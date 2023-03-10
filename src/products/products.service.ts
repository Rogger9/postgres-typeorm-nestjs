import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationDto } from 'src/common/dtos/pagination.dto'
import { DataSource, Repository } from 'typeorm'
import { validate as isUUID } from 'uuid'
import { CreateProductDto, UpdateProductDto } from './dto'
import { Product, ProductImage } from './entities'

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...data } = createProductDto
      const product = this.productRepository.create({
        ...data,
        images: images.map(url => this.productImageRepository.create({ url })),
      })
      await this.productRepository.save(product)
      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll({ limit = 10, offset = 0 }: PaginationDto) {
    const products = await this.productRepository.find({ take: limit, skip: offset, relations: { images: true } })

    return products.map(({ images, ...data }) => ({ ...data, images: images.map(img => img.url) }))
  }

  async findOne(term: string) {
    let product: Product

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      const query = this.productRepository.createQueryBuilder('prod')
      product = await query
        .where('UPPER(title) =:title or slug =:slug', { title: term.toUpperCase(), slug: term.toLowerCase() })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne()
    }

    if (!product) throw new NotFoundException(`Product with ${term} not found`)

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...data } = updateProductDto

    const product = await this.productRepository.preload({ id, ...data })

    if (!product) throw new NotFoundException(`Product with id ${id} not found`)

    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: id })
        product.images = images.map(url => this.productImageRepository.create({ url }))
      }

      await queryRunner.manager.save(product)

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return await this.findOnePlain(id)
    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()

      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return 'Product deleted'
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term)
    return { ...product, images: images.map(img => img.url) }
  }

  private handleDBExceptions(error: any) {
    if (+error.code === 23505) throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException()
  }

  async deleteAllProduct() {
    const query = this.productRepository.createQueryBuilder()
    try {
      return await query.delete().where({}).execute()
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }
}

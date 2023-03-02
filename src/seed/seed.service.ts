import { Injectable } from '@nestjs/common'
import { ProductsService } from 'src/products/products.service'
import { initialData } from './data/seed.data'

@Injectable()
export class SeedService {
  constructor(private readonly productService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts()

    return 'Run seed'
  }

  private async insertNewProducts() {
    await this.productService.deleteAllProduct()

    const insertPromises = initialData.products.map(product => this.productService.create(product))

    await Promise.all(insertPromises)

    return true
  }
}

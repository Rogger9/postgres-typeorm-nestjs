import { BadRequestException, Injectable } from '@nestjs/common'
import { existsSync } from 'fs'
import { join } from 'path'

@Injectable()
export class FilesService {
  getStaticImage(name: string) {
    const path = join(__dirname, '../../static/products', name)

    if (!existsSync(path)) throw new BadRequestException(`No product found with image ${name}`)

    return path
  }
}

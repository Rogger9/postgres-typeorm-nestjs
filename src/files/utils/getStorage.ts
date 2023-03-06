import { diskStorage } from 'multer'
import { fileNamer } from '.'

export const getStorage = () => diskStorage({ destination: './static/products', filename: fileNamer })

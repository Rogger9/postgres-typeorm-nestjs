import { v4 as uuid } from 'uuid'
import { FileUtil } from './fileFilter'

export const fileNamer: FileUtil<string> = (_, file, cb) => {
  const [, fileExt] = file.mimetype.split('/')
  const fileName = uuid() + '.' + fileExt

  cb(null, fileName)
}

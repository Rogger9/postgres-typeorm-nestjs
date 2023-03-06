import { Request } from 'express'

export type FileUtil<T> = {
  (req: Request, file: Express.Multer.File, cb: (a: Error, b: T) => void): void
}

const validExt = ['jpg', 'jpeg', 'png']

export const fileFilter: FileUtil<boolean> = (_, file, cb) => {
  if (!file) return cb(new Error('File is empty'), false)

  const [, fileExt] = file.mimetype.split('/')

  if (!validExt.includes(fileExt)) return cb(null, false)

  return cb(null, true)
}

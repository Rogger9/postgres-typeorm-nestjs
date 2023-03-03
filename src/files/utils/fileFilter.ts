import { Request } from 'express'

type FileFilterUtil = {
  (req: Request, file: Express.Multer.File, cb: (a: Error, b: boolean) => void): void
}

const validExt = ['jpg', 'jpeg', 'png']

export const fileFilter: FileFilterUtil = (req, file, cb) => {
  if (!file) return cb(new Error('File is empty'), false)

  const [, fileExt] = file.mimetype.split('/')

  if (!validExt.includes(fileExt)) return cb(null, false)

  return cb(null, true)
}

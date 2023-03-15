import { Request } from 'express';
import { MulterError } from 'multer';

export const fileFilter = (req: Request, file: any, cb: any) => {
    if (file.mimetype.split('/')[0] === 'image') {
        cb(null, true)
    } else {
        cb(new MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
}
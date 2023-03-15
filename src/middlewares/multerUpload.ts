import multer from 'multer';
import { fileFilter } from '../utils/fileFilter';
import { Request, Router } from 'express';

const MB = 5 // 5 MB
const FILE_SIZE_LIMIT =  MB * 1024 * 1024

const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        cb(null, '/public/uploads')
    },
    filename: (req: Request, file: any, cb: any) => {
        cb(null, `${req.user.id}`)
    }
})


export const upload = multer({ storage, fileFilter, limits: { fileSize: FILE_SIZE_LIMIT } })
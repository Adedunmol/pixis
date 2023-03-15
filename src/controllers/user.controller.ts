import { Request, Response } from "express";
import { changePasswordSchema } from "../schema/user.schema";
import { BadRequest } from "../errors/BadRequest";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../config/dbConn";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/NotFound";
import cloudinary from "../utils/cloudinary";

export const changePasswordController = async (req: Request<{}, {}, changePasswordSchema>, res: Response) => {
    const result = changePasswordSchema.safeParse(req.body)

    if (!result.success) {
        throw new BadRequest(fromZodError(result.error).toString())
    }

    const user = await prisma.user.findFirst({
        where: {
            id: req.user.id
        }
    })

    if (!user) throw new BadRequest('')

    const match = await bcrypt.compare(result.data.oldPassword, user?.password)

    if (!match) throw new BadRequest('Old passwords do not match')

    const newPassword = await bcrypt.hash(result.data.newPassword, 10)

    const updatedUser = await prisma.user.update({
        where: {
            id: req.user.id
        },
        data: {
            password: newPassword
        }
    })

    return res.status(StatusCodes.OK).json({ message: 'Password changed' })
}


export const getUserController = async (req: Request<{ id: string }>, res: Response) => {
    const userId = req.params.id

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        },
        select: {
            password: false
        }
    })

    if (!user) throw new NotFound('No user found with this id')

    return res.status(StatusCodes.OK).json({ data: user })
}

export const updateUserController = async (req: Request, res: Response) => {

}

export const uploadImageController = async (req: Request, res: Response) => {
    
    if (!req.file) throw new BadRequest('File is needed')

    const result = await cloudinary.v2.uploader.upload(req.file.path, {
        public_id: `${req.user.id}_profile`,
    })

    const user = await prisma.user.update({
        where: {
            id: req.user.id
        },
        data: {
            imageUrl: result.url
        },
        select: {
            password: false
        }
    })
    
    return res.status(StatusCodes.OK).json({ message: 'Image uploaded', data: user })
}
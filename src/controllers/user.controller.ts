import { Request, Response } from "express";
import { changePasswordSchema } from "../schema/user.schema";
import { BadRequest } from "../errors/BadRequest";
import { fromZodError } from "zod-validation-error";
import { prisma } from "../config/dbConn";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/NotFound";

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
        }
    })

    if (!user) throw new NotFound('No user found with this id')

    return res.status(StatusCodes.OK).json({ data: user })
}
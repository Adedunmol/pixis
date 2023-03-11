import { Request, Response } from 'express';
import { fromZodError } from 'zod-validation-error';
import { BadRequest } from '../errors/BadRequest';
import { createUserSchema } from '../schema/auth.schema';
import bcrypt from "bcrypt";
import { prisma } from '../config/dbConn';
import { StatusCodes } from 'http-status-codes';

export const createUserController = async (req: Request<{}, {}, createUserSchema>, res: Response) => {
    const result = createUserSchema.safeParse(req.body)

    if (!result.success) {
        throw new BadRequest(fromZodError(result.error).toString())
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10)
    const userPayload = { ...result.data, password: hashedPassword }

    const createdUser = await prisma.user.create({
        data: userPayload,
        select: {
            password: false
        }
    })

    return res.status(StatusCodes.CREATED).json({ createdUser })
}
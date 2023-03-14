import { Request, Response } from "express";
import { createCardSchema } from "../schema/card.schema";
import { BadRequest } from "../errors/BadRequest";
import { fromZodError } from 'zod-validation-error';
import { prisma } from "../config/dbConn";
import { StatusCodes } from "http-status-codes";

export const createCardHandler = async (req: Request<{}, {}, createCardSchema>, res: Response) => {
    const result = createCardSchema.safeParse(req.body)

    if (!result.success) {
        throw new BadRequest(fromZodError(result.error).toString())
    }
    const cardPayload = { ...result.data, author: { connect: { id: req.user.id } } }

    const card = await prisma.card.create({
        data: cardPayload
    })

    return res.status(StatusCodes.CREATED).json({ data: card })
}
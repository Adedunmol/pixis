import { Request, Response } from "express";
import { createCardSchema } from "../schema/card.schema";
import { BadRequest } from "../errors/BadRequest";
import { fromZodError } from 'zod-validation-error';
import { prisma } from "../config/dbConn";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/NotFound";

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

export const getCardsHandler = async (req: Request, res: Response) => {
    const cards = await prisma.card.findMany({
        where: {
            authorId: req.user.id
        }
    })

    return res.status(StatusCodes.OK).json({ data: cards, nbHits: cards.length })
}

export const getCardHandler = async (req: Request<{ id: string }>, res: Response) => {
    const card = await prisma.card.findFirst({
        where: {
            id: req.params.id
        }
    })

    if (!card) throw new NotFound('No card found with this id')

    return res.status(StatusCodes.OK).json({ data: card})
}
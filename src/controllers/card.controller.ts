import { Request, Response } from "express";
import { createCardSchema, updateCardSchema } from "../schema/card.schema";
import { BadRequest } from "../errors/BadRequest";
import { fromZodError } from 'zod-validation-error';
import { prisma } from "../config/dbConn";
import { StatusCodes } from "http-status-codes";
import { NotFound } from "../errors/NotFound";
import customEvents from "../events";
import { ForbiddenError } from "../errors/Forbidden";
import { superMemo, superMemoGrade } from "../utils/sm-2";
import { Prisma } from "@prisma/client";

const grades = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'E': 1,
    'F': 0,
}

export const createCardHandler = async (req: Request<{}, {}, createCardSchema>, res: Response) => {
    const result = createCardSchema.safeParse(req.body)

    if (!result.success) {
        throw new BadRequest(fromZodError(result.error).toString())
    }
    const cardPayload = { ...result.data, author: { connect: { id: req.user.id } } }

    const card = await prisma.card.create({
        data: cardPayload
    })

    const cardDetails = { 
        nextInterval: card.nextInterval!,
        repetition: card.repetition!,
        eFactor: Number(card.eFactor),
    }

    const smemoGrade = grades['A'] as superMemoGrade

    const smemoItem = superMemo(cardDetails, smemoGrade)

    const updatedCardDetails = { ...smemoItem, eFactor: new Prisma.Decimal(smemoItem.eFactor) }

    const updatedCard = await prisma.card.update({
        where: {
            id: card.id
        }, 
        data: updatedCardDetails
    })

    customEvents.emit('schedule', updatedCard)

    return res.status(StatusCodes.CREATED).json({ data: updatedCard })
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

export const deleteCardHandler = async (req: Request<{ id: string }>, res: Response) => {
    let card = await prisma.card.findFirst({
        where: {
            id: req.params.id
        }
    })

    if (!card) throw new NotFound('No card found with this id')

    const userId = req.user.id

    if (card?.authorId !== userId) throw new ForbiddenError('You are not the owner of this card')

    card = await prisma.card.delete({
        where: {
            id: req.params.id
        }
    })

    return res.status(StatusCodes.OK).json({ message: 'card deleted', data: card })
}

export const updateCardHandler = async (req: Request<{ id: string }, {}, updateCardSchema>, res: Response) => {
    const result = updateCardSchema.safeParse(req.body)

    if (!result.success) {
        throw new BadRequest(fromZodError(result.error).toString())
    }

    const card = await prisma.card.findFirst({
        where: {
            id: req.params.id
        }
    })

    if (!card) throw new NotFound('No card found with this id')

    const cardDetails = { 
        nextInterval: card.nextInterval!,
        repetition: card.repetition!,
        eFactor: Number(card.eFactor),
    }

    const smemoGrade = grades[req.body.grade] as superMemoGrade

    const smemoItem = superMemo(cardDetails, smemoGrade)

    const updatedCardDetails = { ...smemoItem, eFactor: new Prisma.Decimal(smemoItem.eFactor) }

    const updatedCard = await prisma.card.update({
        where: {
            id: card.id
        }, 
        data: updatedCardDetails
    })

    customEvents.emit('schedule', card)

    return res.status(StatusCodes.OK).json({ data: updatedCard })
}
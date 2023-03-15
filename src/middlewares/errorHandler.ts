import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { MulterError } from "multer";

export const errorHandlerMiddleware = async (err: any, req: Request, res: Response, next: NextFunction) => {

    const customErr = {
        message: err.message || "Something went wrong, try again later",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code === 'P2002') {
            customErr.message = "A user with this email already exists"
            customErr.statusCode = StatusCodes.CONFLICT
        }
    }

    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            customErr.message = "File is too large"
            customErr.statusCode = StatusCodes.BAD_REQUEST
        }

        if (err.code === 'LIMIT_FILE_COUNT') {
            customErr.message = "File limit reached"
            customErr.statusCode = StatusCodes.BAD_REQUEST
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            customErr.message = "File must be an image"
            customErr.statusCode = StatusCodes.BAD_REQUEST
        }
    }

    return res.status(customErr.statusCode).json({ message: customErr.message })
}
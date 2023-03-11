import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "@prisma/client";
import { BaseError } from "../errors/Base";

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

}
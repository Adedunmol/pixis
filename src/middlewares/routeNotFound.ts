import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const routeNotFoundMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "route not found" })
}
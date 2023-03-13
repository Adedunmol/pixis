import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '../errors/Forbidden';
import { UnauthorizedError } from '../errors/Unauthorized';
import { DecodedData } from '../utils/interfaces';


export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']

    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedError('You are not authorized')

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET!,
        {},
        (err, decoded) => {
            if (err) throw new ForbiddenError("Invalid token")
            const data = decoded as DecodedData
            req.user = data.email
            next()
        }
    )
}
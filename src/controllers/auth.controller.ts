import { Request, Response } from 'express';
import { fromZodError } from 'zod-validation-error';
import { BadRequest } from '../errors/BadRequest';
import { createUserSchema, loginUserSchema } from '../schema/auth.schema';
import bcrypt from "bcrypt";
import { prisma } from '../config/dbConn';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { ForbiddenError } from '../errors/Forbidden';
import { UnauthorizedError } from '../errors/Unauthorized';
import { DecodedData } from '../utils/interfaces';

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

    return res.status(StatusCodes.CREATED).json({ data: createdUser })
}

export const loginUserController = async (req: Request<{}, {}, loginUserSchema>, res: Response) => {
    const result = loginUserSchema.safeParse(req.body)

    if (!result.success) {
        throw new BadRequest(fromZodError(result.error).toString())
    }

    const foundUser = await prisma.user.findFirst({
        where: {
            email: result.data.email
        }
    })

    if (!foundUser) throw new BadRequest("No user found with this email")

    const match = await bcrypt.compare(result.data.password, foundUser.password)

    if (match) {
        const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000
        const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000

        const accessToken = jwt.sign(
            { email: foundUser.email, id: foundUser.id }, 
            process.env.ACCESS_TOKEN_SECRET!, 
            { expiresIn: '15m' }
        )
        const refreshToken = jwt.sign(
            { email: foundUser.email }, 
            process.env.REFRESH_TOKEN_SECRET!, 
            { expiresIn: '1d' }
        )

        const user = await prisma.user.update({
            where: {
                email: foundUser.email
            },
            data: {
                refreshToken
            }
        })

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: COOKIE_MAX_AGE })

        return res.status(StatusCodes.OK).json({ token: accessToken, expiresIn: ACCESS_TOKEN_EXPIRATION })
    }
}

export const refreshTokenController = async (req: Request, res: Response) => {
    const cookies = req.cookies

    if (!cookies?.jwt) throw new UnauthorizedError('there is no refresh token')
    const refreshToken = cookies.jwt

    const foundUser = await prisma.user.findFirst({
        where: {
            refreshToken
        }
    })

    if (!foundUser) throw new ForbiddenError('not allowed to visit this route')

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        {},
        async (err, decoded) => {
            const data = decoded as DecodedData
            if (err || foundUser.email !== data.email) throw new ForbiddenError('bad token')
        
            const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000
            const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000

            const accessToken = jwt.sign(
                { email: data.email, id: data.id }, 
                process.env.ACCESS_TOKEN_SECRET!, 
                { expiresIn: '15m' }
            )
            const refreshToken = jwt.sign(
                { email: data.email }, 
                process.env.REFRESH_TOKEN_SECRET!, 
                { expiresIn: '1d' }
            )

            const user = await prisma.user.update({
                where: {
                    email: foundUser.email
                },
                data: {
                    refreshToken
                }
            })

            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: COOKIE_MAX_AGE })

            return res.status(StatusCodes.OK).json({ token: accessToken, expiresIn: ACCESS_TOKEN_EXPIRATION })
        }
    )
}

export const logoutUserController = async (req: Request, res: Response) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(StatusCodes.NO_CONTENT)
    const refreshToken = cookies.jwt

    const foundUser = await prisma.user.findFirst({
        where: {
            refreshToken
        }
    })

    const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000

    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: COOKIE_MAX_AGE })
        return res.sendStatus(StatusCodes.NO_CONTENT)
    }

    const user = await prisma.user.update({
        where: {
            email: foundUser.email
        },
        data: {
            refreshToken: ''
        }
    })

    res.clearCookie('jwt', { httpOnly: true, maxAge: COOKIE_MAX_AGE })
    return res.sendStatus(StatusCodes.NO_CONTENT)
}
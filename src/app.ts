import express, { Request, Response } from 'express';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import { routeNotFoundMiddleware } from './middlewares/routeNotFound';
import cookieParser from 'cookie-parser';

import authRouter from "./routes/auth.route";
import cardRouter from "./routes/card.route";
import userRouter from "./routes/user.route";
import customEvents from './events';
import scheduler from './jobs/scheduler';
import { Card } from '@prisma/client'
import { nextIntervalDate } from './utils/intervalDate';
import { verifyJWT } from './middlewares/verifyJWT';

const app = express()

customEvents.on('schedule', async (data: Card) => {
    const date = nextIntervalDate(data)
    await scheduler.dueDateMail(date, data)
})

app.use(express.json())
app.use(cookieParser())

app.get("/", async (req: Request, res: Response) => {
    return res.json({ "message": "app running" })
})

app.use("/api/v1/auth", authRouter)

app.use(verifyJWT)

app.use('/api/v1/cards', cardRouter)
app.use('/api/v1/users', userRouter)

app.use(routeNotFoundMiddleware)
app.use(errorHandlerMiddleware)

export default app;
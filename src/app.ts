import express from 'express';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import { routeNotFoundMiddleware } from './middlewares/routeNotFound';
import cookieParser from 'cookie-parser';

import authRouter from "./routes/auth.route";
import customEvents from './event';
import scheduler from './jobs/scheduler';
import { Card } from '@prisma/client'
import { nextIntervalDate } from './utils/intervalDate';

const app = express()

customEvents.on('schedule', async (data: Card) => {
    const date = nextIntervalDate(data)
    await scheduler.dueDateMail(date, data)
})

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)

app.use(routeNotFoundMiddleware)
app.use(errorHandlerMiddleware)

export default app;
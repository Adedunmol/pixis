import express from 'express';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import { routeNotFoundMiddleware } from './middlewares/routeNotFound';
import cookieParser from 'cookie-parser';

import authRouter from "./routes/auth.route";

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/auth", authRouter)

app.use(routeNotFoundMiddleware)
app.use(errorHandlerMiddleware)

export default app;
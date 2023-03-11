import express from 'express';
import { errorHandlerMiddleware } from './middlewares/errorHandler';
import { routeNotFoundMiddleware } from './middlewares/routeNotFound';

import authRouter from "./routes/auth.route";

const app = express();

app.use("/api/v1/auth", authRouter)

app.use(routeNotFoundMiddleware)
app.use(errorHandlerMiddleware)

export default app;
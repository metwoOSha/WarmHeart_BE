import 'dotenv/config';
import express from 'express';
import { SERVER_PORT } from './config.js';
import cors from 'cors';
import blanketsRouter from './routes/blankets.routes.js';
import authRouter from './routes/auth.routes.js';
import cartRouter from './routes/cart.routes.js';
import cookieParser from 'cookie-parser';

const server = express();

server.use(cookieParser());
server.use(
    cors({
        origin: process.env.NEXT_PUBLIC_APP_URL,
        credentials: true,
    })
);
server.use(express.json());

server.use('/api/blankets', blanketsRouter);
server.use('/api/auth', authRouter);
server.use('/api/cart', cartRouter);

server.listen(SERVER_PORT, () => {
    console.log(`server start on port ${SERVER_PORT}`);
});

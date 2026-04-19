import 'dotenv/config';
import express from 'express';
import { SERVER_PORT } from './config.js';
import cors from 'cors';
import blanketsRouter from './routes/blankets.routes.js';
import authRouter from './routes/auth.routes.js';

const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/blankets', blanketsRouter);
server.use('/api/auth', authRouter);

server.listen(SERVER_PORT, () => {
    console.log(`server start on port ${SERVER_PORT}`);
});

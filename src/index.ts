import 'dotenv/config';
import express from 'express';
import { SERVER_PORT } from './config';
import blanketsRouter from './routes/blankets.routes';

const server = express();

server.use('/api/blankets', blanketsRouter);

server.listen(SERVER_PORT, () => {
    console.log(`server start on port ${SERVER_PORT}`);
});

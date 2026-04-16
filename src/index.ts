import express from 'express';
import { SERVER_PORT } from './config';

const server = express();

server.listen(SERVER_PORT, () => {
    console.log(`server start on port ${SERVER_PORT}`);
});

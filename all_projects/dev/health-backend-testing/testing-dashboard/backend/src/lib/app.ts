import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cros from 'cors';

export const server = express();

const port = process.env.PORT;

server.use(bodyParser.json());
server.use(cros());

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

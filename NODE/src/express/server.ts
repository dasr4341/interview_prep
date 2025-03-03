import express, { Request, Response, NextFunction  } from 'express';
const PORT = 4040;

const server = express();

server.use()
server.get('/', (_req: Request, res: Response) => {
 res.json({ test: 'hey'})
})


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
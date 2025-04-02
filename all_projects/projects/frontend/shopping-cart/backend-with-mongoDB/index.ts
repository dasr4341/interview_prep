import express, { NextFunction, Request, Response } from "express";
import cartRouter from "./api-routes/cartRoute.js";
import { config } from "./config/config.js";
import { mongodb } from "./db/mongodbConnect.js";
import { authorization } from "./middlewares/authorization.middleware.js";

const server = express();
const { port } = config.server;

// connecting to db
mongodb();

server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));
server.use(authorization);

// routes
server.use(cartRouter);

// not found page
server.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Page Not Found');
    return next(error);
});



// error handling
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
server.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({
      success: false,
      message: error?.message || '',
      data: error?.data || null,
    });
});

  
server.listen(port, () => {
    console.log(`server is listening at http://localhost:${port}`);
  });
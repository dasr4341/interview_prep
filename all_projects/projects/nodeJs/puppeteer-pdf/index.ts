import express, { Request, Response, NextFunction } from "express";
import { config } from "./config/appConfig";
import { Exception, ExceptionType } from "./lib/Exception/exception.lib";
import { StatusCodes } from "http-status-codes";
import { generatePdf } from "./lib/Pdf/generatePdf";
import { data } from "./lib/Pdf/data";

const server = express();

server.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const pdf = await generatePdf(data);
  res.set({ "Content-Type": "application/pdf", "Content-Length": pdf.length });
  res.send(pdf);
});

// error handling -------------------------------------
server.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Exception(
    "Page Not Found",
    StatusCodes.NOT_FOUND,
    ExceptionType.HTTP,
    null
  );
  return next(error);
});

server.use(
  (error: Exception, req: Request, res: Response, next: NextFunction) => {
    res.status(error.errorCode).json({
      success: false,
      message: error.message,
      data: error.data,
    });
  }
);
// ------------------------------------------------------

server.listen(config.port, () => {
  console.log(`server is listening at http://localhost:${config.port}`);
});

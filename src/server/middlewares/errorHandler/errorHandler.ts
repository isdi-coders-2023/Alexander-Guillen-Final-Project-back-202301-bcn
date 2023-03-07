import "../../../loadEnvironment.js";
import { type NextFunction, type Request, type Response } from "express";
import createDebug from "debug";
import type CustomError from "../../../CustomError/CustomError.js";

const debug = createDebug("lingodeck:src:server:middlewares:errorHandler");

const errorHandler = (
  error: CustomError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  debug(error.message);

  response
    .status(error.statusCode || 500)
    .json({ error: error.publicMessage || "Something went wrong" });
};

export default errorHandler;

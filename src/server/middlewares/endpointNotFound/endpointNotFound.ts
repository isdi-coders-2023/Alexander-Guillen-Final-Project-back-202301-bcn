import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";

const endpointNotFound = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const notFoundError = new CustomError(
    "Endpoint not found",
    404,
    "Endpoint not found"
  );

  next(notFoundError);
};

export default endpointNotFound;

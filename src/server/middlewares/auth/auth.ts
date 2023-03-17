import jwt from "jsonwebtoken";
import { type NextFunction, type Response } from "express";
import { type UserId, type CustomRequest } from "../../../types.js";
import CustomError from "../../../CustomError/CustomError.js";

const auth = (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = request.header("Authorization");

    if (!authorizationHeader) {
      throw new Error("Authorization header is missing");
    }

    if (!authorizationHeader.startsWith("Bearer ")) {
      throw new Error("Missing 'Bearer' in authorization header");
    }

    const token = authorizationHeader.replace(/^Bearer\s*/, "");
    const { id } = jwt.verify(token, process.env.JWT_KEY!) as UserId;

    request.userId = id;
    next();
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      403,
      "Invalid token"
    );

    next(customError);
  }
};

export default auth;

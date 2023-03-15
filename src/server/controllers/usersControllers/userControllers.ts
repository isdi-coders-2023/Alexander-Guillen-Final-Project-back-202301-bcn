import "../../../loadEnvironment.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import { type UserCredentials } from "../../../types";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";

const loginUser = async (
  request: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  response: Response,
  next: NextFunction
) => {
  const wrongCredentialsError = new CustomError(
    "Wrong credentials",
    401,  
    "username or password were incorrect"
  );
  try {
    const { password, username } = request.body;
    const user = await User.findOne({ username }).exec();

    if (!user) {
      throw wrongCredentialsError;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw wrongCredentialsError;
    }

    const userCredentialsTokenPayload = {
      id: user?._id,
      username,
    };
    const token = jwt.sign(userCredentialsTokenPayload, process.env.JWT_KEY!);

    response.status(201).json({ token });
  } catch (error) {
    const loginGeneralError = new CustomError(
      (error as CustomError).message,
      (error as CustomError).statusCode,
      (error as CustomError).publicMessage
    );

    next(loginGeneralError);
  }
};

export default loginUser;

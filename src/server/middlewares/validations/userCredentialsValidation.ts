import { type NextFunction, type Request, type Response } from "express";
import { Joi } from "express-validation";
import CustomError from "../../../CustomError/CustomError.js";

const userCredentialsValidation = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const credentialsValidation = Joi.object({
    username: Joi.string().alphanum().min(8).max(24).required(),
    password: Joi.string().alphanum().min(8).max(24).required(),
  });

  const { error } = credentialsValidation.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details
      .map((detail) => detail.message)
      .join(" && ");
    const validationError = new CustomError(
      "Invalid user credentials",
      403,
      errorMessages
    );

    next(validationError);
  }
};

export default userCredentialsValidation;

import { type NextFunction, type Request, type Response } from "express";
import { Joi } from "express-validation";
import CustomError from "../../../../CustomError/CustomError.js";
import { type UserCredentials } from "../../../../types.js";

const userCredentialsValidation = (
  request: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
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
  } else {
    next();
  }
};

export default userCredentialsValidation;

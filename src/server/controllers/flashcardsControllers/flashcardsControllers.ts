import { type Response, type Request, type NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError";
import User from "../../../database/models/User";
import { type FlashcardModel } from "../../../database/types";
import { type UserId } from "../../../types";

export const getFlahscards = async (
  request: Request<Record<string, unknown>, Record<string, unknown>, UserId>,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.body;

    const user = await User.findById(id)
      .populate<{ flashcards: FlashcardModel }>("flashcards")
      .exec();

    response.status(200).json({ flashcards: user?.flashcards });
  } catch (error) {
    const getFlashcardsError = new CustomError(
      (error as Error).message,
      0,
      "There was an error getting flashcards"
    );

    next(getFlashcardsError);
  }
};

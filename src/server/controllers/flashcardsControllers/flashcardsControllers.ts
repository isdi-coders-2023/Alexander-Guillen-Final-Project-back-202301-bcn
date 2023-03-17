import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Flashcard from "../../../database/models/Flashcard.js";
import User from "../../../database/models/User.js";
import { type FlashcardModel } from "../../../database/types.js";
import { type UserId, type CustomRequest } from "../../../types.js";

export const getFlashcards = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const id = request.userId;

    const user = await User.findById(id)
      .populate<{ flashcards: FlashcardModel[] }>("flashcards")
      .exec();

    const flashcards = user?.flashcards.map(
      ({ language, back, front, id, image, imageBackup }) => ({
        language,
        back,
        front,
        id,
        image,
        imageBackup,
      })
    );

    response.status(200).json({ flashcards });
  } catch (error) {
    const getFlashcardsError = new CustomError(
      (error as Error).message,
      0,
      "There was an error getting flashcards"
    );

    next(getFlashcardsError);
  }
};

export const deleteFlashcard = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params;
    const flashcard = await Flashcard.findByIdAndDelete(id).exec();

    response.status(200).json({
      message: `Flashcard (${flashcard!.front} | ${
        flashcard!.back
      }) deleted succesfully`,
    });
  } catch (error) {
    const deleteFlashcardError = new CustomError(
      (error as Error).message,
      0,
      "There was a problem deleting the flashcard"
    );

    next(deleteFlashcardError);
  }
};

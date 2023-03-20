import { type Response, type NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Flashcard from "../../../database/models/Flashcard.js";
import User from "../../../database/models/User.js";
import { type FlashcardModel } from "../../../database/types.js";
import { type CustomRequest } from "../../../types.js";

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
      ({ language, back, front, id, image }) => ({
        language,
        back,
        front,
        id,
        image,
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
    const idOfUser = request.userId;
    const { id } = request.params;
    const flashcard = await Flashcard.findByIdAndDelete(id).exec();

    await User.findByIdAndUpdate(
      idOfUser,
      { $pull: { flashcards: id } },
      { new: true }
    ).exec();

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

export const createFlashcard = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const flashcard = request.body;
    const { userId } = request;

    const newFlashcardDocument = await Flashcard.create(flashcard);
    await User.findByIdAndUpdate(userId, {
      $addToSet: { flashcards: newFlashcardDocument._id },
    }).exec();

    response.status(201).json({
      message: `Flashcard (${newFlashcardDocument.front} | ${newFlashcardDocument.back}) created succesfully`,
    });
  } catch (error) {
    const createFlashcardError = new CustomError(
      (error as Error).message,
      0,
      "There was a problem creating the flashcard"
    );

    next(createFlashcardError);
  }
};

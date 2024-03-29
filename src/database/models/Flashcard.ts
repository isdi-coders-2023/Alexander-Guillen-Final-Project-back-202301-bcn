import mongoose from "mongoose";
import { type FlashcardModel } from "../types";

const flashcardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const Flashcard = mongoose.model<FlashcardModel>(
  "Flashcard",
  flashcardSchema,
  "flashcards"
);

export default Flashcard;

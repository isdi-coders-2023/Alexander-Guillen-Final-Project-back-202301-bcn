import { type Types } from "mongoose";

export interface FlashcardModel {
  _id: Types.ObjectId;
  front: string;
  back: string;
  image: string;
  language: string;
}

export type FlashcardStructure = Omit<FlashcardModel, "_id">;
export interface MockFlashcards extends FlashcardStructure {
  id: string;
}
export type Flashcards = FlashcardStructure[];
export interface UserModel {
  username: string;
  password: string;
  flashcards: Types.ObjectId[];
}

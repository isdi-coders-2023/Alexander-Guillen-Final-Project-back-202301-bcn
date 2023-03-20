import { type Types } from "mongoose";

export interface FlashcardModel {
  id: string;
  front: string;
  back: string;
  image: string;
  language: string;
}

export interface UserModel {
  username: string;
  password: string;
  flashcards: Types.ObjectId[];
}

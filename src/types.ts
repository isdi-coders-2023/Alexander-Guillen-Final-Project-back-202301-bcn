import { type Request } from "express";
import { type FlashcardStructure } from "./database/types";

export interface ResponseError {
  error: string;
}

export interface ResponseMessage {
  message: string;
}

export interface Token {
  token: string;
}
export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserId {
  id: string;
}

export interface CustomRequest extends Request {
  userId: string;
  params: {
    id: string;
  };
  body: FlashcardStructure;
}

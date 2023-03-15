import { type Request } from "express";

export interface ResponseError {
  error: string;
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
}

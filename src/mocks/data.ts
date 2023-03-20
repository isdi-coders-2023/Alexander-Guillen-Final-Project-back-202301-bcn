import { type Response, type Request } from "express";
import { type MockFlashcards } from "../database/types";

export const request: Partial<Request> = {};
export const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
export const next = jest.fn();
export const mockFlashcards: MockFlashcards[] = [
  {
    id: "641129f79f3cfb43b4418b1e",
    back: "The capital city of France",
    front: "What is Paris?",
    image: "https://example.com/paris.jpg",
    language: "English",
  },
  {
    id: "64112a0bc69ab057352c5014",
    back: "The chemical symbol for water",
    front: "What is H2O?",
    image: "https://example.com/h2o.jpg",
    language: "English",
  },
  {
    id: "64112a1931db01e684891578",
    back: "The year the first iPhone was released",
    front: "What is 2007?",
    image: "https://example.com/iphone.jpg",
    language: "English",
  },
];

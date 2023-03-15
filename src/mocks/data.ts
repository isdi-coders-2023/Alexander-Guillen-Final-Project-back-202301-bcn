import { type Response, type Request } from "express";
import { type FlashcardModel } from "../database/types";

export const request: Partial<Request> = {};
export const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
export const next = jest.fn();
export const flashcards: FlashcardModel[] = [
  {
    id: "6409d298f5c4e943969fc56f",
    back: "The capital city of France",
    front: "What is Paris?",
    image: "https://example.com/paris.jpg",
    imageBackup: "https://example.com/paris_backup.jpg",
    language: "English",
  },
  {
    id: "63423234f1212f5c4e94396f",
    back: "The chemical symbol for water",
    front: "What is H2O?",
    image: "https://example.com/h2o.jpg",
    imageBackup: "https://example.com/h2o_backup.jpg",
    language: "English",
  },
  {
    id: "640955559555453969fc56f",
    back: "The year the first iPhone was released",
    front: "What is 2007?",
    image: "https://example.com/iphone.jpg",
    imageBackup: "https://example.com/iphone_backup.jpg",
    language: "English",
  },
];

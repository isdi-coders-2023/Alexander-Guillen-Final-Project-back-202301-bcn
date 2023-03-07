import { type NextFunction, type Response } from "express";

export const request: Partial<Request> = {};

export const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

export const next: NextFunction = jest.fn();

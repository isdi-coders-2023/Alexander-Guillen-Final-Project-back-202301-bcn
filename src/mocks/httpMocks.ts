import { type NextFunction, type Response, type Request } from "express";

export const request = {} as Partial<Request>;

export const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

export const next: NextFunction = jest.fn();

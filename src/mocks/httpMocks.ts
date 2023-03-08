import { type Response, type Request } from "express";

export const request: Partial<Request> = {};

export const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

export const next = jest.fn();

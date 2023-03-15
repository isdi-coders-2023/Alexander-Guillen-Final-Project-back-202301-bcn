import jwt from "jsonwebtoken";
import { type Response } from "express";
import { next, response } from "../../../mocks/data";
import { type UserId, type CustomRequest } from "../../../types";
import auth from "./auth";

describe("Given an auth controller", () => {
  afterEach(() => {
    next.mockClear();
  });

  describe("When it receives a request with Authorization header 'Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
    test("Then it should respond call next", () => {
      const userId: UserId = {
        id: "6407a2accaa85b5217cc1f44",
      };
      jwt.verify = jest.fn().mockReturnValue(userId);

      const request: Partial<CustomRequest> = {
        header: jest
          .fn()
          .mockReturnValue("Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'"),
      };

      auth(request as CustomRequest, response as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request withouth Authorization header ''", () => {
    test("Then it should respond with error 'Authorization header is missing'", () => {
      const request: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValue(""),
      };
      const message = "Authorization header is missing";
      const statusCode = 403;
      const publicMessage = "Invalid token";

      auth(request as CustomRequest, response as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty("message", message);
      expect(next.mock.calls[0][0]).toHaveProperty("statusCode", statusCode);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        publicMessage
      );
    });
  });

  describe("When it receives a request with Authorization header 'RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
    test("Then it should respond with error 'Missing 'Bearer' in authorization header'", () => {
      const request: Partial<CustomRequest> = {
        header: jest
          .fn()
          .mockReturnValue("RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo"),
      };
      const message = "Missing 'Bearer' in authorization header";

      auth(request as CustomRequest, response as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty("message", message);
    });
  });
});

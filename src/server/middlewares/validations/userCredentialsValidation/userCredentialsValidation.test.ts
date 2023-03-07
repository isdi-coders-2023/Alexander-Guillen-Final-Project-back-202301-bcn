import { type Request, type Response } from "express";
import { type UserCredentials } from "../../../../types.js";
import { next, request, response } from "../../../../mocks/httpMocks.js";
import userCredentialsValidation from "./userCredentialsValidation.js";

describe("Given an userCredentialsValidation middleware", () => {
  const status = 403;
  const message = "Invalid user credentials";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("When it receives a request that has username 'aguillen' and password 'user1'", () => {
    test("Then it should call next with error message 'Invalid user credentials', status 403 and publicMessage '\"password\" length must be at least 8 characters long'", () => {
      request.body = {
        username: "aguillen",
        password: "user1",
      } as UserCredentials;
      const publicMessage =
        '"password" length must be at least 8 characters long';

      userCredentialsValidation(request as Request, response as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty("message", message);
      expect(next.mock.calls[0][0]).toHaveProperty("statusCode", status);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        publicMessage
      );
    });
  });

  describe("When it receives a request that has username '-90-A-123(409)' and password 'alexanderGH123'", () => {
    test("Then it should respond with error message 'Invalid user credentials', status 403 and publicMessage '\"username\" must only contain alpha-numeric characters'", () => {
      request.body = {
        username: "-90-A-123(409)",
        password: "alexanderGH123",
      } as UserCredentials;
      const publicMessage =
        '"username" must only contain alpha-numeric characters';

      userCredentialsValidation(request as Request, response as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty("message", message);
      expect(next.mock.calls[0][0]).toHaveProperty("statusCode", status);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        publicMessage
      );
    });
  });
});

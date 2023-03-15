import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { type Response, type Request } from "express";
import User from "../../../database/models/User";
import { next, request, response } from "../../../mocks/data.js";
import { type Token, type UserCredentials } from "../../../types.js";
import loginUser from "./userControllers";

describe("Given a loginUser controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const message = "Wrong credentials";
  const status = 401;
  const publicMessage = "username or password were incorrect";

  describe("When it receives a request with username 'alexander' and passsword 'usuario1'", () => {
    test("Then it should return a response with token 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'", async () => {
      const expectedToken: Token = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };
      const expectedStatus = 201;

      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: "6407a2accaa85b5217cc1f44",
          password: "usuario1",
        }),
      }));

      bcrypt.compare = jest
        .fn()
        .mockImplementationOnce(
          (requestPassword: string, databasePassword: string) =>
            requestPassword === databasePassword
        );

      jwt.sign = jest
        .fn()
        .mockReturnValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");

      request.body = {
        username: "alexander",
        password: "usuario1",
      };

      await loginUser(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
      expect(response.json).toHaveBeenCalledWith(expectedToken);
    });
  });

  describe("When it receives a rsequest with username 'fakeAlexander'", () => {
    test("Then it should call next with error message 'Wrong credentials', status 401, and public message 'username or password were incorrect'", async () => {
      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      request.body = {
        username: "fakeAlexander",
        password: "usuario1",
      };

      await loginUser(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        response as Response,
        next
      );

      expect(next.mock.calls[0][0]).toHaveProperty("message", message);
      expect(next.mock.calls[0][0]).toHaveProperty("statusCode", status);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        publicMessage
      );
    });
  });

  describe("When it receives a request with username with password 'fakeUsuario1'", () => {
    test("Then it call next with error message 'Wrong Credentials', status 401, and public message 'username or password were incorrect'", async () => {
      User.findOne = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: "6407a2accaa85b5217cc1f44",
          password: "usuario1",
        }),
      }));

      request.body = {
        username: "alexander",
        password: "fakeUsuario1",
      };

      bcrypt.compare = jest
        .fn()
        .mockImplementationOnce(
          (requestPassword: string, databasePassword: string) =>
            requestPassword === databasePassword
        );

      await loginUser(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserCredentials
        >,
        response as Response,
        next
      );

      expect(next.mock.calls[0][0]).toHaveProperty("message", message);
      expect(next.mock.calls[0][0]).toHaveProperty("statusCode", status);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        publicMessage
      );
    });
  });
});

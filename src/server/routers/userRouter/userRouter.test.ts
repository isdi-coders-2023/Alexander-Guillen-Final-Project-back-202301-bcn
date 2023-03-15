import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../../database/connectDatabase";
import app from "../../app";
import User from "../../../database/models/User";
import {
  type ResponseError,
  type Token,
  type UserCredentials,
} from "../../../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  jest.clearAllMocks();
});

describe("Given a POST /user/login endpoint", () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("usuario1", 10);
    const userAlexander: UserCredentials = {
      username: "alexander",
      password: hashedPassword,
    };
    await User.create(userAlexander);
  });

  describe.only("When it receives a request with username 'alexander' and password 'usuario1'", () => {
    test("Then it should respoand with token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", async () => {
      jwt.sign = jest
        .fn()
        .mockReturnValue("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
      const user: UserCredentials = {
        username: "alexander",
        password: "usuario1",
      };
      const expectedToken: Token = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };

      const response = await request(app)
        .post("/user/login")
        .send(user)
        .expect(201);

      expect(response.body).toStrictEqual(expectedToken);
    });
  });

  describe("When it receives a request with username 'fakeAlexander' and password 'usuario1'", () => {
    test("Then it should respond with error message 'Wrong credentials', status 401, and public message 'username or password were incorrect'", async () => {
      const user: UserCredentials = {
        username: "fakeAlexander",
        password: "usuario1",
      };
      const expectedResponseError: ResponseError = {
        error: "username or password were incorrect",
      };

      const response = await request(app)
        .post("/user/login")
        .send(user)
        .expect(401);

      expect(response.body).toStrictEqual(expectedResponseError);
    });
  });

  describe("When it receives a request with username 'alexander' and password 'fakePassword'", () => {
    test("Then it should respond with erro message 'Wrong credentials', status 401, and public message 'username or password were incorrect'", async () => {
      const user: UserCredentials = {
        username: "alexander",
        password: "fakePassword",
      };
      const expectedResponseError: ResponseError = {
        error: "username or password were incorrect",
      };

      const response = await request(app)
        .post("/user/login")
        .send(user)
        .expect(401);

      expect(response.body).toStrictEqual(expectedResponseError);
    });
  });
});

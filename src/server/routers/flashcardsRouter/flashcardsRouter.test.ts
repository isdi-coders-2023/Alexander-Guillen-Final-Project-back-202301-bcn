import jwt from "jsonwebtoken";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import connectDatabase from "../../../database/connectDatabase";
import Flashcard from "../../../database/models/Flashcard";
import User from "../../../database/models/User";
import { mockFlashcards } from "../../../mocks/data";
import app from "../../app";
import { type UserId, type ResponseError } from "../../../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

describe("Given a GET /flashcards controller", () => {
  beforeAll(async () => {
    const user = new User({
      username: "Alexander",
      password: "$2a$12$oJn6vCAQX0Xcxg78ovu/heSYbPmaA/D0DBsFb4..IrCSLyu9M2gaq",
      flashcards: mockFlashcards.map(({ id }) => new Types.ObjectId(id)),
    });

    user._id = new Types.ObjectId("6411b78612dc066c43f20019");

    await user.save();

    mockFlashcards.forEach(async (flashcard) => {
      const newFlashcard = new Flashcard(flashcard);
      newFlashcard._id = new Types.ObjectId(flashcard.id);

      await newFlashcard.save();
    });
  });

  describe("When it receives a request with header Authorization 'Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
    const authorizationHeader =
      "Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo";
    const userId: UserId = {
      id: "6411b78612dc066c43f20019",
    };
    jwt.verify = jest.fn().mockReturnValue(userId);

    test("Then it should respond with three flashcards", async () => {
      const response = await request(app)
        .get("/flashcards")
        .set("Authorization", authorizationHeader)
        .expect(200);

      expect(response.body).toStrictEqual({ flashcards: mockFlashcards });
    });
  });
  const error: ResponseError = {
    error: "Invalid token",
  };

  describe("When it receives a request without header Authorization", () => {
    test("Then it should respond with error 'Invalid token'", async () => {
      const response = await request(app).get("/flashcards").expect(403);

      expect(response.body).toStrictEqual(error);
    });
  });

  describe("When it receives a request with header Authorization 'RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
    test("Then it should respond with error 'Invalid token'", async () => {
      const authorizationHeader = "RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo";

      const response = await request(app).get("/flashcards").expect(403);

      expect(response.body).toStrictEqual(error);
    });
  });
});

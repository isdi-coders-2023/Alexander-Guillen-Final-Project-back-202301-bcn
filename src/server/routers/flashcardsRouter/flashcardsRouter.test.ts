import jwt from "jsonwebtoken";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import connectDatabase from "../../../database/connectDatabase";
import Flashcard from "../../../database/models/Flashcard";
import User from "../../../database/models/User";
import { mockFlashcards } from "../../../mocks/data";
import app from "../../app";
import {
  type UserId,
  type ResponseError,
  type ResponseMessage,
} from "../../../types";
import { type FlashcardStructure } from "../../../database/types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
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

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

const userId: UserId = {
  id: "6411b78612dc066c43f20019",
};

jwt.verify = jest.fn().mockReturnValue(userId);

const authorizationHeader = "Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo";

describe("Given a GET /flashcards controller", () => {
  describe("When it receives a request with header Authorization 'Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
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

  describe("When it receives a request with header Authorization Header 'RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
    test("Then it should respond with error 'Invalid token'", async () => {
      const authorizationHeader = "RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo";

      const response = await request(app)
        .get("/flashcards")
        .set("Authorization", authorizationHeader)
        .expect(403);

      expect(response.body).toStrictEqual(error);
    });
  });
});

describe("Given a DELETE /flashcards/:id endpoint", () => {
  describe("When it receives a request with query param '641129f79f3cfb43b4418b1e' and Authorization Header 'Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
    test("Then it should respond with status 200 and message 'Flashcard (What is Paris? | The capital city of France) deleted succesfully'", async () => {
      const id = "641129f79f3cfb43b4418b1e";
      const expectedMessage: ResponseMessage = {
        message:
          "Flashcard (What is Paris? | The capital city of France) deleted succesfully",
      };

      const response = await request(app)
        .delete(`/flashcards/${id}`)
        .set("Authorization", authorizationHeader)
        .expect(200);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with query param '641485c71550e185506ec632' and Authorization Header 'Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo'", () => {
    test("Then it should respond with status 500 and error 'There was a problem deleting the flashcard'", async () => {
      const id = "641485c71550e185506ec632";
      const expectedError: ResponseError = {
        error: "There was a problem deleting the flashcard",
      };

      const response = await request(app)
        .delete(`/flashcards/${id}`)
        .set("Authorization", authorizationHeader)
        .expect(500);

      expect(response.body).toStrictEqual(expectedError);
    });
  });
});

describe("Given a POST /flashcards endpoint", () => {
  const flashcard: FlashcardStructure = {
    front: "Cat",
    back: "Gato",
    language: "English",
    image: "http://example.image.com/image.jpg",
  };

  describe("When it receives a request with Authorization Header 'Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo' and a flashcard", () => {
    test("Then it should respond with status 201 and message 'Flashcard (Cat | Gato) created succesfully'", async () => {
      const expectedMessage: ResponseMessage = {
        message: "Flashcard (Cat | Gato) created succesfully",
      };

      const response = await request(app)
        .post("/flashcards")
        .send(flashcard)
        .set("Authorization", authorizationHeader)
        .expect(201);

      expect(response.body).toStrictEqual(expectedMessage);
    });
  });

  describe("When it receives a request with Authorization Header 'Bearer RISERO?rYsLDYo-6?3RMUSsizfbEqj0/?Q!cFZfo' and just a front and back", () => {
    test("Then it should respond with status 500 and message 'There was a problem creating the flashcard'", async () => {
      const mockFlashcard: Pick<FlashcardStructure, "front" | "back"> = {
        front: flashcard.front,
        back: flashcard.back,
      };
      const expectedError: ResponseError = {
        error: "There was a problem creating the flashcard",
      };

      const response = await request(app)
        .post("/flashcards")
        .send(mockFlashcard)
        .set("Authorization", authorizationHeader)
        .expect(500);

      expect(response.body).toStrictEqual(expectedError);
    });
  });
});

import { type Request, type Response } from "express";
import Flashcard from "../../../database/models/Flashcard";
import User from "../../../database/models/User";
import { mockFlashcards, next, response } from "../../../mocks/data";
import { type UserId, type CustomRequest } from "../../../types";
import { deleteFlashcard, getFlashcards } from "./flashcardsControllers";

afterEach(() => {
  next.mockClear();
});

describe("Given a getFlashcards controller", () => {
  describe("When it receives a request with id '6409d298f5c4e943969fc56f'", () => {
    test("Then it should respond with status 200 and three flashcards", async () => {
      const request: Partial<CustomRequest> = {
        userId: "6409d298f5c4e943969fc56f",
      };

      User.findById = jest.fn().mockImplementationOnce(() => ({
        populate: () => ({
          exec: () => ({ flashcards: mockFlashcards }),
        }),
      }));

      await getFlashcards(request as CustomRequest, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        flashcards: mockFlashcards,
      });
    });
  });

  describe("When it receives a request with id '7657e62f3cc2", () => {
    test("Then it should call next with incorrect id error", async () => {
      User.findById = jest.fn().mockImplementationOnce(() => ({
        populate: () => ({
          exec() {
            throw new Error("Cast to ObjectId failed");
          },
        }),
      }));

      const request: Partial<CustomRequest> = {
        userId: "6409d298f5c4e943969fc56f",
      };

      await getFlashcards(request as CustomRequest, response as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        "Cast to ObjectId failed"
      );
      expect(next.mock.calls[0][0]).toHaveProperty("statusCode", 0);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        "There was an error getting flashcards"
      );
    });
  });
});

describe("Given a deleteFlashcard controller", () => {
  describe("When it receives a request with param id '641129f79f3cfb43b4418b1e'", () => {
    test("Then it should respond with status 200 and message 'Flashcard (What is Paris? | The capital city of France) deleted succefully'", async () => {
      const request: Partial<Request<UserId>> = {
        params: {
          id: "641129f79f3cfb43b4418b1e",
        },
      };
      Flashcard.findOneAndDelete = jest.fn().mockImplementation(() => ({
        exec: () => mockFlashcards[0],
      }));
      const expectedStatus = 200;
      const expectedMessage =
        "Flashcard (What is Paris? | The capital city of France) deleted succefully";

      await deleteFlashcard(
        request as Request<UserId>,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
      expect(response.json).toHaveBeenCalledWith({
        message: expectedMessage,
      });
    });
  });

  describe("When it receives a request with param id '6414795f6617cf9d5e89adf1'", () => {
    test("Then it should call next with error 'Flashcard not found'", async () => {
      const request: Partial<Request<UserId>> = {
        params: {
          id: "6414795f6617cf9d5e89adf1",
        },
      };
      Flashcard.findOneAndDelete = jest.fn().mockImplementation(() => ({
        exec() {
          throw new Error("Flashcard not found");
        },
      }));
      const expectedStatus = 0;
      const expectedMessage = "Flashcard not found";
      const expectedPublicMessage =
        "There was a problem deleting the flashcard";

      await deleteFlashcard(
        request as Request<UserId>,
        response as Response,
        next
      );

      expect(next.mock.calls[0][0]).toHaveProperty("message", expectedMessage);
      expect(next.mock.calls[0][0]).toHaveProperty(
        "statusCode",
        expectedStatus
      );
      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        expectedPublicMessage
      );
    });
  });
});

import { type Request, type Response } from "express";
import Flashcard from "../../../database/models/Flashcard";
import User from "../../../database/models/User";
import { type FlashcardModel } from "../../../database/types";
import { mockFlashcards, next, response } from "../../../mocks/data";
import { type UserId, type CustomRequest } from "../../../types";
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcards,
} from "./flashcardsControllers";

beforeEach(() => {
  next.mockClear();
});

describe("Given a getFlashcards controller", () => {
  describe("When it receives a request with id '6409d298f5c4e943969fc56f'", () => {
    test("Then it should respond with status 200 and three flashcards", async () => {
      const request: Partial<CustomRequest> = {
        userId: "6409d298f5c4e943969fc56f",
      };

      const flashcardsWithUnderscore = mockFlashcards.map((mockFlashcard) =>
        Object.defineProperty(mockFlashcard, "_id", {
          value: mockFlashcard.id,
        })
      );

      User.findById = jest.fn().mockImplementationOnce(() => ({
        populate: () => ({
          exec: () => ({
            flashcards: flashcardsWithUnderscore,
          }),
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
  User.findByIdAndUpdate = jest.fn().mockImplementation(() => ({
    exec: () => undefined,
  }));

  describe("When it receives a request with param id '641129f79f3cfb43b4418b1e'", () => {
    test("Then it should respond with status 200 and message 'Flashcard (What is Paris? | The capital city of France) deleted succefully'", async () => {
      const request: Partial<CustomRequest> = {
        params: {
          id: "641129f79f3cfb43b4418b1e",
        },
      };
      Flashcard.findOneAndDelete = jest.fn().mockImplementation(() => ({
        exec: () => mockFlashcards[0],
      }));
      const expectedStatus = 200;
      const expectedMessage =
        "Flashcard (What is Paris? | The capital city of France) deleted succesfully";

      await deleteFlashcard(
        request as CustomRequest,
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
        request as CustomRequest,
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

describe("Given a createFlashcard controller", () => {
  describe.only("When it receives a request with id '6409d298f5c4e943969fc56f' and a flashcard", () => {
    test.only("Then it should repond with message 'Flashcard ('What is Paris?' | 'The capital city of France') created succesfully'", async () => {
      const request: Partial<CustomRequest> = {
        userId: "6409d298f5c4e943969fc56f",
        body: mockFlashcards[0],
      };
      const flashcard = mockFlashcards[0];

      Flashcard.create = jest.fn().mockResolvedValue(mockFlashcards[0]);

      User.findByIdAndUpdate = jest.fn().mockImplementation(() => ({
        exec: () => undefined,
      }));

      await createFlashcard(
        request as CustomRequest,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ flashcard })
      );
    });
  });

  describe("When it receives a request with id '6409d298f5c4e943969fc56f' and a flashcard just with the front and the back", () => {
    test("Then it should call next with error 'There was a problem creating the flashcard", async () => {
      jest.restoreAllMocks();

      const mockFlashcard: Partial<FlashcardModel> = {
        front: mockFlashcards[0].front,
        back: mockFlashcards[0].back,
      };
      const request: Partial<CustomRequest> = {
        userId: "6409d298f5c4e943969fc56f",
        body: mockFlashcard as FlashcardModel,
      };
      const expectedMessage = "There was a problem creating the flashcard";

      User.findByIdAndUpdate = jest.fn().mockImplementation(() => ({
        exec: () => undefined,
      }));

      await createFlashcard(
        request as CustomRequest,
        response as Response,
        next
      );

      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        expectedMessage
      );
    });
  });
});

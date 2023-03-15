import { type Request, type Response } from "express";
import User from "../../../database/models/User";
import { flashcards, next, request, response } from "../../../mocks/data";
import { type UserId } from "../../../types";
import { getFlahscards } from "./flashcardsControllers";

describe("Given a getFlashcards controller", () => {
  describe("When it receives a request with id '6409d298f5c4e943969fc56f'", () => {
    test("Then it should respond with status 200 and three flashcards", async () => {
      User.findById = jest.fn().mockImplementationOnce(() => ({
        populate: () => ({
          exec: () => ({ flashcards }),
        }),
      }));
      request.body = {
        id: "6409d298f5c4e943969fc56f",
      };

      await getFlahscards(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserId
        >,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({ flashcards });
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

      request.body = {
        id: "7657e62f3cc2",
      };

      await getFlahscards(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserId
        >,
        response as Response,
        next
      );

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

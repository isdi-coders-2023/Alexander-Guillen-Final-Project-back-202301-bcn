import { type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import { next, request, response } from "../../../mocks/data.js";
import endpointNotFound from "./endpointNotFound";

describe("Given an endpointNotFound middleware", () => {
  describe("When it is called", () => {
    test("Then it should call next function with an error that has message, public message 'Endpoint not found', and status code 404", () => {
      const notFoundError = new CustomError(
        "Endpoint not found",
        404,
        "Endpoint not found"
      );

      endpointNotFound(request as Request, response as Response, next);

      expect(next).toHaveBeenCalledWith(notFoundError);
    });
  });
});

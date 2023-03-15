import { type Response, type Request } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import { next, request, response } from "../../../mocks/data.js";
import { type ResponseError } from "../../../types.js";
import errorHandler from "./errorHandler.js";

describe("Given an errorHandler middleware", () => {
  describe("When it receives an error with status code 404 and public message 'Endpoint not found'", () => {
    test("Then it should respond with a status code 404 and error message 'Endpoint not found'", () => {
      const notFoundError = new CustomError(
        "Endpoint not found",
        404,
        "Endpoint not found"
      );
      const expectedResponseError: ResponseError = {
        error: "Endpoint not found",
      };
      const expectedResponseStatus = 404;

      errorHandler(
        notFoundError,
        request as unknown as Request,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedResponseStatus);
      expect(response.json).toHaveBeenCalledWith(expectedResponseError);
    });
  });

  describe("When it receives an error with status code 0 and public message ''", () => {
    test("Then it should respond with status code 500 and public message 'Something went wrong'", () => {
      const error = new CustomError("", 0, "");
      const expectedResponseError: ResponseError = {
        error: "Something went wrong",
      };
      const expectedResponseStatus = 500;

      errorHandler(
        error,
        request as unknown as Request,
        response as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedResponseStatus);
      expect(response.json).toHaveBeenCalledWith(expectedResponseError);
    });
  });
});

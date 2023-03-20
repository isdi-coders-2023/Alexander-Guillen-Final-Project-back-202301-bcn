import { Router } from "express";
import {
  createFlashcard,
  deleteFlashcard,
  getFlashcards,
} from "../../controllers/flashcardsControllers/flashcardsControllers.js";
import auth from "../../middlewares/auth/auth.js";

const flashcardsRouter = Router();

flashcardsRouter.get("", auth, getFlashcards);
flashcardsRouter.delete("/:id", auth, deleteFlashcard);
flashcardsRouter.post("", auth, createFlashcard);

export default flashcardsRouter;

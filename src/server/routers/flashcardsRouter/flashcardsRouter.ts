import { Router } from "express";
import {
  deleteFlashcard,
  getFlashcards,
} from "../../controllers/flashcardsControllers/flashcardsControllers.js";
import auth from "../../middlewares/auth/auth.js";

const flashcardsRouter = Router();

flashcardsRouter.get("", auth, getFlashcards);
flashcardsRouter.delete("/:id", auth, deleteFlashcard);

export default flashcardsRouter;

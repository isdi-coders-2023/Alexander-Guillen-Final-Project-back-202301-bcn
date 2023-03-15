import { Router } from "express";
import { getFlashcards } from "../../controllers/flashcardsControllers/flashcardsControllers";
import auth from "../../middlewares/auth/auth";

const flashcardsRouter = Router();

flashcardsRouter.get("", auth, getFlashcards);

export default flashcardsRouter;

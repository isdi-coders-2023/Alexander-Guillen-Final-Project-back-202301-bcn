import { Router } from "express";
import { getFlashcards } from "../../controllers/flashcardsControllers/flashcardsControllers.js";
import auth from "../../middlewares/auth/auth.js";

const flashcardsRouter = Router();

flashcardsRouter.get("", auth, getFlashcards);

export default flashcardsRouter;

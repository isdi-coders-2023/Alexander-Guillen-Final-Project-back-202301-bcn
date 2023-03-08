import { Router } from "express";
import loginUser from "../../controllers/loginUser/loginUser.js";
import userCredentialsValidation from "../../middlewares/validations/userCredentialsValidation/userCredentialsValidation.js";

const userRouter = Router();

const login = "/login";

userRouter.post(login, userCredentialsValidation, loginUser);

export default userRouter;

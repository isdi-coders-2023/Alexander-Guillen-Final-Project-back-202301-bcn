import "../loadEnvironment.js";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routers/userRouter/userRouter.js";
import endpointNotFound from "./middlewares/endpointNotFound/endpointNotFound.js";
import errorHandler from "./middlewares/errorHandler/errorHandler.js";
import flashcardsRouter from "./routers/flashcardsRouter/flashcardsRouter.js";

const app = express();

const localHost = process.env.ORIGIN_URL!;

const options: cors.CorsOptions = {
  origin: localHost,
};

app.disable("x-powered-by");
app.use(morgan("dev"));
app.use(cors(options));
app.use(express.json());

app.use("/user", userRouter);
app.use("/flashcards", flashcardsRouter);
app.use(endpointNotFound);
app.use(errorHandler);
export default app;

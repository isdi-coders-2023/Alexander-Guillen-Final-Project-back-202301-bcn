import "../loadEnvironment.js";
import mongoose from "mongoose";
import createDebug from "debug";
import chalk from "chalk";
import type CustomError from "../CustomError/CustomError.js";

const debug = createDebug("lingodeck:src:database:connect");

const connectDatabase = async (uri: string) => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(uri);
    debug(chalk.green("Connected to the database"));
  } catch (error) {
    debug(
      chalk.red(
        `Error while connecting to the database. ${(error as Error).message}`
      )
    );
  }
};

export default connectDatabase;

import "../loadEnvironment.js";
import createDebug from "debug";
import type CustomError from "../CustomError/CustomError.js";
import app from "./app.js";

const debug = createDebug("lingodeck:startServer");

const startServer = async (port: number) =>
  new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug(`Server is listening on http://localhost:${port}`);
      resolve(server);
    });

    server.on("error", (error: CustomError) => {
      let errorMessage = "Error on starting the server.";

      if (error.code === "EADDRINUSE") {
        errorMessage += ` There's another server running on ${port}`;
        debug(errorMessage);
      }
    });
  });

export default startServer;

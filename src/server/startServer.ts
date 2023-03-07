import "../loadEnvironment.js";
import chalk from "chalk";
import createDebug from "debug";
import app from "./app.js";

const debug = createDebug("lingodeck:src:server:startServer");

const startServer = async (port: number) =>
  new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`Server is listening on http://localhost:${port}`));
      resolve(server);
    });

    server.on("error", (error: CustomError) => {
      let errorMessage = "Error on starting the server.";

      if (error.code === "EADDRINUSE") {
        errorMessage += ` There's another server running on ${port}`;
        debug(chalk.red(errorMessage));
      }
    });
  });

export default startServer;

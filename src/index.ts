import "./loadEnvironment.js";
import connectDatabase from "./database/connectDatabase.js";
import startServer from "./server/startServer.js";

const port = process.env.PORT ?? 4000;
const databaseUrl = process.env.MONGO_DB_URL!;

await connectDatabase(databaseUrl);
await startServer(+port);

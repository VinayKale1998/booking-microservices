import express from "express";
import dotenv from "dotenv";
import { currentUserRouter } from "./routes/current-user";

dotenv.config();
const app = express();

app.use(express.json());

app.use(currentUserRouter);

const PORT = process.env.PORT;
app
  .listen(PORT, () => {
    console.log(`Auth server is listening to port ${PORT}`);
  })
  .on("error", (err: Error) => {
    console.log(`server failed to start : ${err}`);
  });

process.on("SIGINT", () => {
  console.log("Node process terminated");
  process.exit(0);
});

process.on("exit", (code: number) => {
  console.log(`process ended with code ${code}`);
});

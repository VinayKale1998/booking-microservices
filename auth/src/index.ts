import express from "express";
//to allow async error throws to be handled by express directly rather than having to send it off with next();
import "express-async-errors";
import dotenv from "dotenv";
import { currentUserRouter } from "./routes/current-user";
import { signOutRouter } from "./routes/signout";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "../middlewares/error-handler";
import { NotFoundError } from "./Errors/not-found-error";

dotenv.config();

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

//wiringg up the random route handler before the erorr handler, because we are going to throw an Error;
app.get("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.get("/demo", (req, res) => {
  console.log("inside app");
  return res.send({ message: "inside app" });
});

const PORT = process.env.PORT;

app
  .listen(PORT, () => {
    console.log(`Auth server is listening to port ${PORT} modified `);
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

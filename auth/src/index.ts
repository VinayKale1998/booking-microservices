import express from "express";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
//to allow async error throws to be handled by express directly rather than having to send it off with next();
import "express-async-errors";
import dotenv from "dotenv";
import { currentUserRouter } from "./routes/current-user";
import { signOutRouter } from "./routes/signout";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./Errors/not-found-error";

import cors from "cors";
import { InternalServerError } from "./Errors/internal-server-error";

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

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

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new InternalServerError("JWT Secret not found");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
  const PORT = process.env.PORT;
  app
    .listen(PORT, () => {
      console.log(`Auth server is listening to port ${PORT} modified `);
    })
    .on("error", (err: Error) => {
      console.log(`server failed to start : ${err.stack}`);
    });
};

start();

process.on("SIGINT", () => {
  console.log("Node process terminated");
  process.exit(0);
});

process.on("exit", (code: number) => {
  console.log(`process ended with code ${code}`);
});

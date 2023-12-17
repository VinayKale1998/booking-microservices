import express from "express";
import cookieSession from "cookie-session";
//to allow async error throws to be handled by express directly rather than having to send it off with next();
import "express-async-errors";
import dotenv from "dotenv";
import { currentUserRouter } from "./routes/current-user";
import { signOutRouter } from "./routes/signout";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@vr-vitality/common";

import cors from "cors";

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(cors());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" ? true : false,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);

app.use(signOutRouter);
app.use(signUpRouter);

//wiringg up the random route handler before the erorr handler, because we are going to throw an Error;
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export default app;

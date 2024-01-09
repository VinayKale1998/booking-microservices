import express from "express";
import cookieSession from "cookie-session";
//to allow async error throws to be handled by express directly rather than having to send it off with next();
import "express-async-errors";
import dotenv from "dotenv";
import { currentUser, errorHandler, NotFoundError } from "@vr-vitality/common";
import cors from "cors";
import { createRouter } from "./routes/create";
import { showRouter } from "./routes/show";
import { indexRouter } from "./routes";
import { updateRouter } from "./routes/update";

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

//we use the current use middleware before all the routes, and if the user is authenticated, the req.currentUser is set
//but the routes decide whether they should let the user enter by using requireAuth middleware at their end
app.use(currentUser);
app.use(createRouter);
app.use(showRouter);
app.use(indexRouter);
app.use(updateRouter);

//wiringg up the random route handler before the erorr handler, because we are going to throw an Error;
app.all("*", async () => {
  throw new NotFoundError();
});
app.use(errorHandler);

export default app;

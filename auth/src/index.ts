import express from "express";
import dotenv from "dotenv";
import { currentUserRouter } from "./routes/current-user";
import { signOutRouter } from "./routes/signout";
import { signInRouter } from "./routes/signin";
import { signUpRouter } from "./routes/signup";
dotenv.config();

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

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

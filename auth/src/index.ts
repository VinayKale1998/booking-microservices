import { InternalServerError } from "@vr-vitality/common";
import app from "./app";
import mongoose from "mongoose";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new InternalServerError("JWT Secret not found");
  }
  if (!process.env.MONGO_URI) {
    throw new InternalServerError("MONGO_URI not found");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
  }
  const PORT = 3000;
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

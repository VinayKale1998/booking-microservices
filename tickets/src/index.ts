import { InternalServerError } from "@vr-vitality/common";
import app from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new InternalServerError("JWT Secret not found");
  }

  if (!process.env.MONGO_URI) {
    throw new InternalServerError("MONGO_URI not found");
  }
  try {
    await natsWrapper.connect(
      "ticketing",
      "sfsffsvvvvvv",
      "http://nats-srv:4222"
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    await mongoose.connect(process.env.MONGO_URI);
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

//graceful shutdown , closing out the nats connection as well for letting nats server know about the certain death
process.on("SIGINT", () => {
  console.log("Node process INTERRUPTED");
  natsWrapper.client.close();
});

//graceful shutdown , closing out the nats connection as well for letting nats server know about the certain death
process.on("SIGTERM", () => {
  console.log("Node process TERMINATED");
  natsWrapper.client.close();
});
process.on("exit", (code: number) => {
  console.log(`process ended with code ${code}`);
});

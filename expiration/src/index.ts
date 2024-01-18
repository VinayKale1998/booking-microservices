import { InternalServerError } from "@vr-vitality/common";
import { natsWrapper } from "./nats-wrapper";
const start = async () => {
  if (!process.env.NATS_URL) {
    throw new InternalServerError("MONGO_URI not found");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new InternalServerError("MONGO_URI not found");
  }
  if (!process.env.NATA_CLIENT_ID) {
    throw new InternalServerError("MONGO_URI not found");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATA_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
  } catch (err) {
    console.log(err);
  }
  const PORT = process.env.PORT;
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

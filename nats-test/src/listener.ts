import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketUpdatedListener } from "./events/ticket-updated-listener";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to NATS");

  new TicketUpdatedListener(stan).listen();
});

stan.on("close", () => {
  console.log("Nats connection ended");
  process.exit();
});

//to let nats know that the process has been shutdown and not wait for it, send the events onto other processes
//alsp a graceful shutdown
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

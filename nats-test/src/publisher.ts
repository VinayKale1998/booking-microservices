import { url } from "inspector";
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-create-publisher";

console.clear();
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "124",
      title: "Concert",
      price: 20,
    });
  } catch (err) {
    console.log(err);
  }

  //graceful closing of the client
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });
});

//   const data = JSON.stringify({
//     id: "sfsf",
//     title: "connect",
//     price: 20,
//   });

//   //the callback if added will run, as and when the event gets published
//   stan.publish("ticket:created", data, () => {
//     console.log("Event Published");
//   });
// });

//listen to interrupt and termination signals to gracefully call stan.close()
process.on("SIGNINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

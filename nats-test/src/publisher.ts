import { url } from "inspector";
import nats from "node-nats-streaming";

console.clear();
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", () => {
  console.log("publisher connected to NATS");

  //graceful closing of the client
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const data = JSON.stringify({
    id: "sfsf",
    title: "connect",
    price: 20,
  });

  //the callback if added will run, as and when the event gets published
  stan.publish("ticket:created", data, () => {
    console.log("Event Published");
  });
});

//listen to interrupt and termination signals to gracefully call stan.close()
process.on("SIGNINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

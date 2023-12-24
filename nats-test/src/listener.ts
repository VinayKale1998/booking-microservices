import nats, {
  Subscription,
  type Message,
  type Stan,
} from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to NATS");

  //setting options for the subscription

  const options = stan.subscriptionOptions().setManualAckMode(true);

  //channel name and queue group name
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data == "string") {
      console.log(`Received event ${msg.getSequence()}, with data:${data}`);

      //acknowledging the message processing
      msg.ack();
    }
  });
});

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;

  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,

      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received :${this.subject} /${this.queueGroupName} `);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    const buffer = Buffer.from(data).toString();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}

class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-service";

  onMessage(data: any, msg: Message): void {
    console.log("Event data!", data);

    msg.ack();
  }
}

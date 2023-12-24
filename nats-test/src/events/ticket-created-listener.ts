import { Message } from "node-nats-streaming";
import { Listener } from "../../../common/src/events/base-listener";
import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-events";
import { Subjects } from "../../../common/src/events/subjects";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  //readonly can also be used, but for understanding sake, I have used annotations
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log("Event received", data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}

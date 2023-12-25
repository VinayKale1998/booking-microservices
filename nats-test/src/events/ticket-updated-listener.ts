import { Message } from "node-nats-streaming";
import { Listener } from "../../../common/src/events/base-listener";
import { TicketUpdatedEvent } from "../../../common/src/events/ticket-updated-event";
import { Subjects } from "../../../common/src/events/subjects";
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  //readonly can also be used, but for understanding sake, I have used annotations
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = "payments-service";

  onMessage(data: TicketUpdatedEvent["data"], msg: Message): void {
    console.log("Event received", data);
    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}

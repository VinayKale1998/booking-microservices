import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@vr-vitality/common";
import { Ticket } from "../../models/ticket-model";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price, id, version } = data;

    const ticket = Ticket.build({ title, price, id, version });

    await ticket.save();

    msg.ack();
  }
}

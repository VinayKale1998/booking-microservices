import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@vr-vitality/common";
import { Ticket } from "../../models/ticket-model";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  /**
   * Checks for ticket presence and updates the ticket
   * @param data the curated ticket document
   * @param msg the message object received from nats
   * @returns a promise with void
   */
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { title, price, id } = data;
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}

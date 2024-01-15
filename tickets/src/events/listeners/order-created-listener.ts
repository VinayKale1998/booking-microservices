import { Listener, OrderCreatedEvent, Subjects } from "@vr-vitality/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticketmodel";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // Find the ticket the order is trying to reserve
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) throw new Error("Ticket not found");

    // mark the ticket as being reserved by setting it's orderId property
    ticket.set({ orderId: data.id });
    //save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      orderId: data.id,
    });
    //ack the message processing
    msg.ack();
  }
}

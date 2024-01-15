import mongoose from "mongoose";
import { natsWrapper } from "../../../__mocks__/nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticketmodel";
import { OrderCancelledEvent } from "@vr-vitality/common";
import { Message } from "node-nats-streaming";
const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "dead",
  });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  const msg: Message = {
    ack: jest.fn(),
  } as unknown as Message;

  return { msg, data, ticket, orderId, listener };
};
it("updates the ticket, published an event and acks the message", async () => {
  const { msg, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

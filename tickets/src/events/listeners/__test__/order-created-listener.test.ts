import mongoose, { set } from "mongoose";
import { natsWrapper } from "../../../__mocks__/nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../models/ticketmodel";
import { OrderCreatedEvent, OrderStatus } from "@vr-vitality/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  //create an instance of the listener

  const listener = new OrderCreatedListener(natsWrapper.client);

  //create and save a a ticket

  const ticket = Ticket.build({
    title: "standup-show",
    price: 10,
    userId: "abc",
  });

  await ticket.save();

  //create a fake data object

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: "abc",
    expiresAt: new Date().toISOString(),
    status: OrderStatus.AwaitingPayment,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // fake msg
  const msg: Message = {
    ack: jest.fn(),
  } as unknown as Message;

  return { ticket, listener, data, msg };
};

it("sets the userId of the ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});
it("ack is invoked", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("published a ticket updated event", async () => {
  const { listener, data, ticket, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});

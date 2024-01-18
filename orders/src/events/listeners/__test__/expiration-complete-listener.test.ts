import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../__mocks__/nats-wrapper";
import { Order, OrderStatus } from "../../../models/order-model";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket-model";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent } from "@vr-vitality/common";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Demo",
    price: 10,
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "adsf",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  console.log(updatedOrder);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it("emits an order cancelled event", async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});
it("ack the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

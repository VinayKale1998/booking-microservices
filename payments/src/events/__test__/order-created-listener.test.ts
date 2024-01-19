import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from "@vr-vitality/common";
import { natsWrapper } from "../../__mocks__/nats-wrapper";
import { Order } from "../../models/order-model";
import { OrderCreatedListener } from "../listeners/order-created-listener";
import mongoose, { mongo } from "mongoose";
import { Message } from "node-nats-streaming";

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "dummy",
    version: 0,
    expiresAt: "dummy",
    status: OrderStatus.Created,
    ticket: {
      id: "dummy",
      price: 10,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates an order", async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

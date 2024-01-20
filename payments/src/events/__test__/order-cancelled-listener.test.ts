import { OrderCancelledEvent, OrderStatus } from "@vr-vitality/common";
import { natsWrapper } from "../../__mocks__/nats-wrapper";
import { Order } from "../../models/order-model";

import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../listeners/order-cancelled-listener";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  //create an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.Created,
    userId: "dummy",
    version: 0,
  });
  await order.save();
  const data: OrderCancelledEvent["data"] = {
    id: order._id,
    version: 1,
    ticket: {
      id: "dummy",
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, order };
};

it("changes the status of an order  to cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const cancelledOrder = await Order.findById(order._id);
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

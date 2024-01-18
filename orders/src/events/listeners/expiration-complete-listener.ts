import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@vr-vitality/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order-model";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("order not found");

    //we don't have to remove the reference to the ticket, because the isReserved will only return true for statuses other than Cancelled
    // even so, if we have to find previous orders that were cancelled and check which ticket they were assoicated with, we need the ticket field
    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}

import { Publisher, OrderCancelledEvent, Subjects } from "@vr-vitality/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

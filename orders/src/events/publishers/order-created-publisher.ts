import { Publisher, OrderCreatedEvent, Subjects } from "@vr-vitality/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

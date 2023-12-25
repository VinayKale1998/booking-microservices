import { Publisher, Subjects, TicketUpdatedEvent } from "@vr-vitality/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

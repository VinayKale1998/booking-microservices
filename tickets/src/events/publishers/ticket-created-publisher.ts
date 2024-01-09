import { Publisher, Subjects, TicketCreatedEvent } from "@vr-vitality/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

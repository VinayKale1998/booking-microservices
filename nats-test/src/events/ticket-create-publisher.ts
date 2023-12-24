import { Publisher } from "../../../common/src/events/base-publisher";
import { TicketCreatedEvent } from "../../../common/src/events/ticket-created-events";
import { Subjects } from "../../../common/src/events/subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

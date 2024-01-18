import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@vr-vitality/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

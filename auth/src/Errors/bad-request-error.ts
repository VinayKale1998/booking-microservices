import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 404;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

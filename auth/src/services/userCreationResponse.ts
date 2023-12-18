import { UserDoc } from "../models/user";

export class UserCreationResponse {
  id: string;
  email: string;
  constructor(user: UserDoc) {
    this.id = user.id;
    this.email = user.email;
  }
}

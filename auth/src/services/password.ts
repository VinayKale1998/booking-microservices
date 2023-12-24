import bcrypt from "bcrypt";
import { BadRequestError } from "@vr-vitality/common";

/* class defined to abstract the password hashing
and comparing mechanism */

export class Password {
  static toHash(password: string): string | undefined {
    try {
      const hash = bcrypt.hashSync(password, 10);
      return hash;
    } catch (err) {
      if (err instanceof Error) throw new BadRequestError(err.message);
    }
  }
  static compare(storedPassword: string, suppliedPassword: string) {
    return bcrypt.compareSync(suppliedPassword, storedPassword);
  }
}

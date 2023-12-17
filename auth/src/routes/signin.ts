import express from "express";
import { validationResult } from "express-validator";
import { signInValidator } from "../services/validators";
import { Request, Response } from "express";
import { RequestValidationError } from "../Errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../Errors/bad-request-error";
import { CustomError } from "../Errors/custom-error";
import { InternalServerError } from "../Errors/internal-server-error";
import { Password } from "../services/password";
import { AuthenticationError } from "../Errors/authentication-error";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const signInRouter = express.Router();

signInRouter.post(
  "/api/users/signin",
  signInValidator,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password }: { email: string; password: string } = req.body;

    try {
      //fetching the user from the db
      const existingUser = await User.findOne({ email });

      //if the user is undefined, user has not registered
      if (!existingUser)
        throw new AuthenticationError("Email not registered, please signup");

      //else
      if (!Password.compare(existingUser.password, password)) {
        console.log(Password.compare(existingUser.password, password));
        console.log(req.session);
        throw new AuthenticationError("Password Invalid");
      }

      //else

      const userJWT = jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.JWT_KEY!,
        { expiresIn: 86400 }
      );

      req.session = {
        jwt: userJWT,
        signin: true,
      };

      console.log(req.session);

      console.log(userJWT);

      res.status(200).send(existingUser);
    } catch (err) {
      if (!(err instanceof CustomError))
        throw new InternalServerError("Error while signing in");
      else {
        throw err;
      }
    }
  }
);

export { signInRouter };

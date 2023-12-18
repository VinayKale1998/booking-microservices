import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "@vr-vitality/common";
import { InternalServerError } from "@vr-vitality/common";
import { BadRequestError } from "@vr-vitality/common";
import { User } from "../models/user";
import { CustomError } from "@vr-vitality/common";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { signUpVaidator } from "../services/validators";
const signUpRouter = express.Router();
dotenv.config();

signUpRouter.post(
  "/api/users/signup",
  signUpVaidator,
  async (req: Request, res: Response) => {
    req.session = null;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("inside signup");
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }
    const user = User.build({ email, password });
    try {
      const savedUser = await user.save();
      const appSecret = process.env.JWT_KEY;

      //default HS256(HMAX with SHA-256 hashing algorithm )
      const userJwt = jwt.sign(
        {
          id: savedUser._id,
          email: savedUser.email,
        },
        appSecret!,
        {
          expiresIn: 86400,
        }
      );

      req.session = {
        jwt: userJwt,
      };
      res.status(201).send({ savedUser });
    } catch (err) {
      if (!(err instanceof CustomError))
        throw new InternalServerError("Error during signup");
      else {
        throw err;
      }
    }
  }
);

export { signUpRouter };

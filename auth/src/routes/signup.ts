import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../Errors/request-validation-error";
import { DatabaseConnectionError } from "../Errors/database-connection-error";
import { InternalServerError } from "../Errors/internal-server-error";
import { BadRequestError } from "../Errors/bad-request-error";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import { Password } from "../services/password";
import { CustomError } from "../Errors/custom-error";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
const signUpRouter = express.Router();
dotenv.config();

signUpRouter.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters "),
  ],
  async (req: Request, res: Response) => {
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
      const appSecret = process.env.APP_SECRET;
      if (!appSecret) {
        throw new InternalServerError(
          "APP_SECRET is not defined in the env. variables"
        );
      }

      //default HS256(HMAX with SHA-256 hashing algorithm )
      const userJwt = jwt.sign(
        {
          id: savedUser._id,
          email: savedUser.email,
        },
        appSecret,
        {
          expiresIn: 86400,
        }
      );
      req.session = {
        jwt: userJwt,
      };
      res.status(201).send({ user: savedUser, jwt: userJwt });
    } catch (err) {
      if (!(err instanceof CustomError))
        throw new InternalServerError("Error during signup");
    }
  }
);

export { signUpRouter };

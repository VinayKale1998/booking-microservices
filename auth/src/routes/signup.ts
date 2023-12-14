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
const signUpRouter = express.Router();

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
      await user.save();
      res.status(201).send(user);
    } catch (err) {
      if (!(err instanceof CustomError))
        throw new InternalServerError("Error during signup");
    }
  }
);

export { signUpRouter };

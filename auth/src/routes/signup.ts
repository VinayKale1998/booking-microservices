import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../Errors/request-validation-error";
import { DatabaseConnectionError } from "../Errors/database-connection-error";

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("inside signup");
      throw new RequestValidationError(errors.array());
    }

    throw new DatabaseConnectionError();
  }
);

export { signUpRouter };

import { currentUser, requireAuth, validateRequest } from "@vr-vitality/common";
import express from "express";
import { Request, Response } from "express";
import { body, ValidationError } from "express-validator";

const createRouter = express.Router();

const validators = [
  body("title").not().isEmpty().withMessage("Title is not  provided"),
  body("price").not().isEmpty().withMessage("price is  not provided"),
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("price must be greater than zero"),
];

createRouter.post(
  "/api/tickets",
  requireAuth,
  validators,
  validateRequest,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { createRouter };

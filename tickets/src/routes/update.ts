import express, { Request, Response, NextFunction } from "express";
import { Ticket } from "../models/ticketmodel";
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  AuthenticationError,
} from "@vr-vitality/common";
import { body } from "express-validator";

const updateRouter = express.Router();

const validators = [
  body("title").not().isEmpty().withMessage("title required"),
  body("price").isFloat({ gt: 0 }).withMessage("price required"),
];
updateRouter.put(
  "/api/tickets/:id",
  requireAuth,
  validators,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) throw new NotFoundError();

    //else
    console.log(req.currentUser);
    res.send(ticket);
  }
);

export { updateRouter };

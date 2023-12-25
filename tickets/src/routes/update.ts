import express, { Request, Response, NextFunction } from "express";
import { ITickerAttrs, ITicketDoc, Ticket } from "../models/ticketmodel";
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  AuthenticationError,
  InternalServerError,
} from "@vr-vitality/common";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

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
    const { title, price } = req.body;
    const ticket: ITicketDoc | null = await Ticket.findById(id);
    if (!ticket) throw new NotFoundError();

    if (ticket.userId !== req.currentUser!.id) {
      throw new AuthenticationError("You are not the owner");
    }

    try {
      ticket.set({
        title,
        price,
      });

      await ticket.save();

      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
      res.send(ticket);
    } catch (err) {
      throw new InternalServerError("Error while updating the ticket");
    }

    throw new InternalServerError("Error while updating the ticket");
  }
);

export { updateRouter };

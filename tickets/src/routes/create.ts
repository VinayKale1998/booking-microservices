import {
  CustomError,
  InternalServerError,
  currentUser,
  requireAuth,
  validateRequest,
} from "@vr-vitality/common";
import express from "express";
import { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket, ITickerAttrs } from "../models/ticketmodel";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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
  async (req: Request, res: Response) => {
    //fetching title and price from the request
    try {
      const { title, price } = req.body;

      // fetching the id of the user from the curretnUser property set by currentUser middleware
      const id = req.currentUser!.id;

      //collating to form a ticket object
      const collatedTicket: ITickerAttrs = { title, price, userId: id };

      //building a ticket doc
      const ticket = Ticket.build(collatedTicket);

      //saving the document
      const savedTicket = await ticket.save();

      //publishig create event
      new TicketCreatedPublisher(natsWrapper.client).publish({
        id: savedTicket.id,
        title: savedTicket.title,
        price: savedTicket.price,
        userId: savedTicket.userId,
      });
      // responding with the ticket created
      res.status(201).send(savedTicket);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerError(err.message);
      }
      if (!(err instanceof CustomError)) {
        throw new InternalServerError(
          "Oops something went wrong during ticket creation"
        );
      }
      throw new InternalServerError("something went wrong");
    }
  }
);

export { createRouter };

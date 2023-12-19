import express, { Request, Response, NextFunction } from "express";
import { Ticket } from "../models/ticketmodel";
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  AuthenticationError,
  InternalServerError,
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
    const { title, price } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) throw new NotFoundError();

    if (ticket.userId !== req.currentUser!.id) {
      throw new AuthenticationError("You are not the owner");
    }

    try {
      console.log("original ticket", ticket);
      //   const updatedTicket = await Ticket.findOneAndUpdate(
      //     { userId: ticket.userId },
      //     { $set: { title, price } },
      //     { new: true }
      //   );

      //we can actuall call the set function on the already fetched ticket document
      ticket.set({
        title,
        price,
      });

      await ticket.save();
      //after we do save, mongoose will make sure that the in memory ticket document gets updated as well

      console.log("updated ticket in route", ticket);
      res.send(ticket);
    } catch (err) {
      throw new InternalServerError("Error while updating the ticket");
    }

    throw new InternalServerError("Error while updating the ticket");
  }
);

export { updateRouter };

import express, { Request, Response, NextFunction } from "express";
import { Ticket } from "../models/ticketmodel";
import { BadRequestError, NotFoundError } from "@vr-vitality/common";

const indexRouter = express.Router();

indexRouter.get(
  "/api/tickets/",
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.find({});

    //else

    res.send(tickets);
  }
);

export { indexRouter };

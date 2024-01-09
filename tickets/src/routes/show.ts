import express, { Request, Response, NextFunction } from "express";
import { Ticket } from "../models/ticketmodel";
import { BadRequestError, NotFoundError } from "@vr-vitality/common";

const showRouter = express.Router();

showRouter.get(
  "/api/tickets/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) throw new NotFoundError();

    //else

    res.send(ticket);
  }
);

export { showRouter };

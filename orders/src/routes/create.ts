import express from "express";
import { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@vr-vitality/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order-model";
import { Ticket } from "../models/ticket-model";

import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
const createOrderRouter = express.Router();

const EXPIRATON_WINDOW_SECONDS = 15 * 60;
const validationCriteria = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("Ticket id must be provided"),
];
createOrderRouter.post(
  "/api/orders",
  requireAuth,
  validationCriteria,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) throw new NotFoundError();

    //verify that this ticket is not already reserved

    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket already reserved");

    //calculate the expiration date for this order
    const expiration = new Date();

    expiration.setSeconds(expiration.getSeconds() + EXPIRATON_WINDOW_SECONDS);
    // Build the order and save it to the database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // publish an event saying that an order was created

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: ticket.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    return res.status(201).send(order);
  }
);

export { createOrderRouter };

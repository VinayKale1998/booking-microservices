import {
  AuthenticationError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@vr-vitality/common";
import express from "express";
import { Request, Response } from "express";
import { param } from "express-validator";
import { Order } from "../models/order-model";
const showOrderRouter = express.Router();

const validationCritera = [
  param("orderId").trim().isMongoId().withMessage("Invalid orderId"),
];
showOrderRouter.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId.trim());

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id)
      throw new AuthenticationError("Not authorized to access this order");

    return res.send(order);
  }
);

export { showOrderRouter };

import {
  AuthenticationError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@vr-vitality/common";
import express from "express";
import { Request, Response } from "express";
import { param } from "express-validator";
import { Order } from "../models/order-model";
const deleteOrderRouter = express.Router();

const validationCriteria = [
  param("orderId").isMongoId().withMessage("Invalid orderId"),
];
deleteOrderRouter.delete(
  "/api/orders/:orderId",
  requireAuth,
  validationCriteria,
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new AuthenticationError("Not authenticated for this resource");
    }

    order.status = OrderStatus.Cancelled;

    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    return res.status(204).send(order);
  }
);
export { deleteOrderRouter };

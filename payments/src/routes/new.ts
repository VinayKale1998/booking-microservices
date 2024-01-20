import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  AuthenticationError,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@vr-vitality/common";
import { Order } from "../models/order-model";
const newRouter = express.Router();

const validator = [
  body("token").not().isEmpty(),
  body("orderId").not().isEmpty(),
];

newRouter.post(
  "/api/payments",
  requireAuth,
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) {
      throw new AuthenticationError("Order doesn't belong to you");
    }

    if (order.status == OrderStatus.Cancelled)
      throw new BadRequestError("Cancelled order cannot be paid for");
    return res.send({ success: true });
  }
);

export { newRouter };

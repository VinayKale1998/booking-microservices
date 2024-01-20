import express, { Request, Response } from "express";
import { body } from "express-validator";
import axios from "axios";
import {
  AuthenticationError,
  BadRequestError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@vr-vitality/common";
import { Order } from "../models/order-model";
import { stripe } from "../stripe";
const newRouter = express.Router();

const validator = [
  body("paymentMethodId").not().isEmpty(),
  body("orderId").not().isEmpty().isMongoId(),
];

newRouter.post(
  "/api/payments/create-intent",
  requireAuth,
  validator,
  validateRequest,
  async (req: Request, res: Response) => {
    const stripePubKey = process.env.STRIPE_PUB_KEY;
    const stripeKey = process.env.STRIPE_KEY;
    const { paymentMethodId, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new BadRequestError("order not found");

    if (order.userId !== req.currentUser!.id) {
      throw new AuthenticationError("Order doesn't belong to you");
    }

    if (order.status == OrderStatus.Cancelled)
      throw new BadRequestError("Cancelled order cannot be paid for");

    console.log("cleared all necessary checks");

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: order.price * 100,
      metadata: { userId: order.userId, orderId: order.id },
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `https://ticketing.dev/orders/`,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "always",
      },
    });
    return res.send({ intent: paymentIntent });
  }
);

export { newRouter };

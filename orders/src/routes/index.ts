import { requireAuth } from "@vr-vitality/common";
import express from "express";
import { Request, Response } from "express";
import { Order } from "../models/order-model";
const indexOrderRouter = express.Router();

indexOrderRouter.get("/api/orders", requireAuth, async (req, res) => {
  const id = req.currentUser!.id;

  const orders = await Order.find({ userId: id }).populate("ticket").exec();

  return res.send(orders);
});
export { indexOrderRouter };

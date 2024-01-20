import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order-model";
import { OrderStatus } from "@vr-vitality/common";

it("Throws 404 for invalid order", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup()[0])
    .send({
      token: "afaf",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});
it("Throws 401 for  an order that is forbidden for the current user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup()[0])
    .send({ orderId: order.id, token: "hello" })
    .expect(401);
});
it("Throws 400 for paying for a cancelled order", async () => {
  const user1 = global.signup();
  const user2 = global.signup();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    version: 0,
    userId: user1[1],
    status: OrderStatus.Cancelled,
  });

  await order.save();
  await request(app)
    .post("/api/payments")
    .set("Cookie", user2[0])
    .send({ orderId: order.id, token: "hello" })
    .expect(401);
});

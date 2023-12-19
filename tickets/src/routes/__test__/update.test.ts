import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

describe("testing update routes", () => {
  it("returns  a 404 if the provided id does not exist", async () => {
    const randomValidId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${randomValidId}`)
      .set("Cookie", global.signup())
      .send({
        title: "title",
        price: 20,
      })
      .expect(404);
  });
  it("returns  a 401 if the user is not authenticated", async () => {
    const randomValidId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${randomValidId}`)
      .send({
        title: "title",
        price: 20,
      })
      .expect(401);
  });
  it("returns  a 401 if the user does not own the ticket", async () => {});
  it("returns  a 400 if the user provides an invalid title or price", async () => {});
});

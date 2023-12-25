import express from "express";
import { Request, Response } from "express";
const indexOrderRouter = express.Router();

indexOrderRouter.get("/api/orders", async (req, res) => {
  return res.send();
});
export { indexOrderRouter };

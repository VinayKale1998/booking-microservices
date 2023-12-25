import express from "express";
import { Request, Response } from "express";
const deleteOrderRouter = express.Router();

deleteOrderRouter.delete("/api/orders:id", async (req, res) => {
  return res.send();
});
export { deleteOrderRouter };

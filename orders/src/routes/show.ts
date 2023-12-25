import express from "express";
import { Request, Response } from "express";
const showOrderRouter = express.Router();

showOrderRouter.get("/api/orders/:id", async (req, res) => {
  return res.send();
});

export { showOrderRouter };

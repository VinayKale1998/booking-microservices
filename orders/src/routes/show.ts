import { requireAuth } from "@vr-vitality/common";
import express from "express";
import { Request, Response } from "express";
const showOrderRouter = express.Router();

showOrderRouter.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    return res.send();
  }
);

export { showOrderRouter };

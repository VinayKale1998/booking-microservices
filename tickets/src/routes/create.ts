import { currentUser, requireAuth } from "@vr-vitality/common";
import express from "express";
import { Request, Response, NextFunction } from "express";

const createRouter = express.Router();

createRouter.post(
  "/api/tickets",
  requireAuth,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

export { createRouter };

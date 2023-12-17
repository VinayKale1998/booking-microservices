import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { CustomError } from "../Errors/custom-error";
import { InternalServerError } from "../Errors/internal-server-error";
import { currentUser } from "../middlewares/current-user";
import { requireAuth } from "../middlewares/require-auth";
dotenv.config();

const currentUserRouter = express.Router();

currentUserRouter.get(
  "/api/users/currentuser",
  currentUser,
  requireAuth,
  (req, res) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { currentUserRouter };

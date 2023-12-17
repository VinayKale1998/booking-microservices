import express from "express";
import dotenv from "dotenv";
import { currentUser } from "../middlewares/current-user";

dotenv.config();

const currentUserRouter = express.Router();

currentUserRouter.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { currentUserRouter };

import express from "express";

const currentUserRouter = express.Router();

currentUserRouter.get("/api/users/currentuser", (req, res) => {
  res.send({ message: "you've reached the currentuser router" });
});

export { currentUserRouter };

import express from "express";

const signInRouter = express.Router();

signInRouter.get("/api/users/signin", (req, res) => {
  res.send({ message: "you've reached the signin router" });
});

export { signInRouter };

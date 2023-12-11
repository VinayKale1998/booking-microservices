import express from "express";

const signOutRouter = express.Router();

signOutRouter.get("/api/users/signout", (req, res) => {
  res.send({ message: "you've reached the signout router" });
});

export { signOutRouter };

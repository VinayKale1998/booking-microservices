import express from "express";
import { InternalServerError } from "../Errors/internal-server-error";

const signOutRouter = express.Router();

signOutRouter.get("/api/users/signout", (req, res) => {
  if (req.session) {
    req.session = null;
    return res.send({});
  }

  throw new InternalServerError("Unable to signout at the momemt");
});

export { signOutRouter };

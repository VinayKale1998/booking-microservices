import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../Errors/authentication-error";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new AuthenticationError("Error authenticating, please login");
  }

  next();
};

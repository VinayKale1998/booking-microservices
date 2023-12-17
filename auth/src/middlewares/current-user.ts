import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../Errors/custom-error";
import { InternalServerError } from "../Errors/internal-server-error";
import { JwtPayload } from "jsonwebtoken";

//declaring the  Request interface from express  to add a currentUser property to the req object
// and annotate req with CustomRequest instead of just Request from express

//a without having to extend the Request interface, instead adding a property directly into the already present interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload | string;
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    req.currentUser = payload;
  } catch (err) {
    if (!(err instanceof CustomError))
      throw new InternalServerError("Error while signing in");
    else {
      throw err;
    }
  }

  next();
};

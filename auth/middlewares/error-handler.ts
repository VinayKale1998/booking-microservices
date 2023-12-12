import { Request, Response, NextFunction } from "express";
import { CustomError } from "../src/Errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode || 400)
      .send({ errors: err.serializeErrors() });
  }

  //fallback
  return res.status(400).send({
    errors: [{ message: "something went wrong" }],
  });
};

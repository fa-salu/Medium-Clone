import type { NextFunction, Request, Response } from "express";

export const errorCatch = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

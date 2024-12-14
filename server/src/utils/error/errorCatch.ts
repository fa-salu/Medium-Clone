// import type { NextFunction, Request, Response } from "express";

// export const errorCatch = (
//   func: (req: Request, res: Response, next: NextFunction) => Promise<void>
// ) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     func(req, res, next).catch((err) => next(err));
//   };
// };

import type { NextFunction, Request, Response } from "express";

export const errorCatch = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next); // Wait for the controller function to complete
    } catch (err) {
      next(err); // If an error occurs, pass it to the next middleware (error handling middleware)
    }
  };
};

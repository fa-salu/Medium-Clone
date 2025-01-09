import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

// Use the correct type from the Express namespace
export interface CustomRequest extends Request {
  file?: Express.Multer.File;
  user?: {
    id: string;
    email: string;
  } & JwtPayload;
}

export type JwtDecoded = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

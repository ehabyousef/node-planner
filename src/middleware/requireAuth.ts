import { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

import { NextFunction } from "express";
import { ProtectedRequest } from "../types/app-requests";
import { ForbiddenError } from "../core/ApiError";

export const canEdit = (req: ProtectedRequest, res: Response, next: NextFunction) => {
  if (req.userRole === "VIEWER") {
    throw new ForbiddenError("Viewers cannot restore versions");
  }
  next();
};


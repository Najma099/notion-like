import { NextFunction, Response } from "express";
import { ProtectedRequest } from "../types/app-requests";
import { AuthFailureError, NotFoundError } from "../core/ApiError";
import {
  findWorkspaceMember,
  getWorkpsaceByWorkspaceId,
} from "../database/repository/workspace.repo";

export const isAdmin = async (
  req: ProtectedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = Number(req.workspaceId);
    const userId = req.user.id;

    const workspace = await getWorkpsaceByWorkspaceId(workspaceId);
    if (!workspace) {
      throw new NotFoundError("Workspace not found");
    }

    if (workspace.ownerId === userId) {
      return next();
    }

    const member = await findWorkspaceMember(workspaceId, userId);
    if (!member || member.role !== "ADMIN") {
      throw new AuthFailureError("Only ADMIN or OWNER allowed");
    }

    return next();
  } catch (err) {
    next(err);
  }
};

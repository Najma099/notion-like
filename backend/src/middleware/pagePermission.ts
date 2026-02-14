
import { prisma } from "../database";
import { ForbiddenError, NotFoundError } from "../core/ApiError";
import { ProtectedRequest } from "../types/app-requests";
import { NextFunction, Response } from "express";

export async function isPageMember(req: ProtectedRequest, res: Response, next: NextFunction) {
  try {
    const pageId = Number(req.params.pageId);
    const userId = req.user.id;

    if (isNaN(pageId)) {
      throw new NotFoundError("Invalid page ID");
    }

    // Find the page and verify user has access through workspace membership
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        workspaceId: true,
        workspace: {
          select: {
            members: {
              where: { userId },
              select: { 
                role: true,
                userId: true 
              }
            }
          }
        }
      }
    });

    if (!page) {
      throw new NotFoundError("Page not found");
    }

    // Check if user is a member of the workspace that owns this page
    const member = page.workspace.members[0];
    if (!member) {
      throw new ForbiddenError("You don't have access to this page");
    }

    // Attach role to request for later use in authorization
    req.userRole = member.role;
    
    // Also attach workspaceId and pageId for convenience
    req.workspaceId = page.workspaceId;
    req.pageId = page.id;

    next();
  } catch (error) {
    next(error);
  }
}
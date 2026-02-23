import { Response } from "express";
import { BadRequestError, NotFoundError } from "../core/ApiError";
import { asyncHandler } from "../core/asyncHandler";
import { SuccessResponse } from "../core/ApiResponse";
import { ProtectedRequest } from "../types/app-requests";
import {
  createPageVersion,
  getPageVersions,
  getPageVersionById,
} from "../database/repository/pageversion.repo";
import { prisma } from "../database/index"; 
import { broadcastToRoom } from "../websocket/room";
import { BlockType } from "@prisma/client";

// GET /workspaces/:workspaceId/pages/:pageId/versions
export const listVersions = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const pageId = Number(req.params.pageId);
    if (isNaN(pageId)) throw new BadRequestError("Invalid page ID");

    const versions = await getPageVersions(pageId);
    new SuccessResponse("Versions fetched", versions).send(res);
  }
);

// GET /workspaces/:workspaceId/pages/:pageId/versions/:versionId
export const getVersion = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const versionId = Number(req.params.versionId);
    if (isNaN(versionId)) throw new BadRequestError("Invalid version ID");

    const version = await getPageVersionById(versionId);
    if (!version) throw new NotFoundError("Version not found");

    new SuccessResponse("Version fetched", version).send(res);
  }
);

// POST /workspaces/:workspaceId/pages/:pageId/versions/:versionId/restore
export const restoreVersion = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const pageId = Number(req.params.pageId);
    const versionId = Number(req.params.versionId);

    if (isNaN(pageId) || isNaN(versionId)) {
      throw new BadRequestError("Invalid IDs");
    }

    const version = await getPageVersionById(versionId);
    if (!version) throw new NotFoundError("Version not found");
    if (version.pageId !== pageId) {
      throw new BadRequestError("Version does not belong to this page");
    }

    const blocks = version.blocks as Array<{
      type: string;
      content: object;
      position: number;
    }>;

    // Overwrite current blocks atomically
    await prisma.$transaction(async (tx) => {
      await tx.block.deleteMany({ where: { pageId } });
      await tx.block.createMany({
        data: blocks.map((b) => ({
          pageId,
          type: b.type as BlockType,
          content: b.content,
          position: b.position,
        })),
      });
    });

    // Save restore as new version — history stays linear, nothing lost
    const newVersion = await createPageVersion(
      pageId,
      blocks,
      req.user.id,
      `Restored from v${version.versionNumber}`
    );

    // Broadcast so all open tabs update instantly
    broadcastToRoom(String(pageId), {
      type: "restore",
      blocks,
      restoredBy: req.user.id,
      versionNumber: newVersion.versionNumber,
    });

    new SuccessResponse("Page restored", {
      versionNumber: newVersion.versionNumber,
    }).send(res);
  }
);

// POST /workspaces/:workspaceId/pages/:pageId/versions
// Called by auto-save hook on the frontend
export const saveVersion = asyncHandler(
  async (req: ProtectedRequest, res: Response) => {
    const pageId = Number(req.params.pageId);
    if (isNaN(pageId)) throw new BadRequestError("Invalid page ID");

    const { blocks } = req.body;
    if (!blocks || !Array.isArray(blocks)) {
      throw new BadRequestError("blocks array required");
    }

    const version = await createPageVersion(pageId, blocks, req.user.id);
    new SuccessResponse("Version saved", { versionNumber: version.versionNumber }).send(res);
  }
);
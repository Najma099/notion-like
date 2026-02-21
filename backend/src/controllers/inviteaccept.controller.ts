import { Response } from "express";
import { AuthFailureError, BadRequestError } from "../core/ApiError";
import { asyncHandler } from "../core/asyncHandler";
import { SuccessMsgResponse, SuccessResponse } from "../core/ApiResponse";
import { ProtectedRequest } from "../types/app-requests";
import {
  addUserToWorkspace,
  deleteInvite,
  findInviteByToken,
  isUserAlreadyMember,
} from "../database/repository/workspaceInvite";

export const acceptWorkspaceInvite = asyncHandler(
  async (req: ProtectedRequest, res: Response): Promise<void> => {
    const token = Array.isArray(req.params.token)
      ? req.params.token[0]
      : req.params.token;

    const user = req.user;
    if (!user) {
      throw new AuthFailureError("Please login to accept invite");
    }

    const invite = await findInviteByToken(token);
    if (!invite) {
      throw new BadRequestError("Invalid invite link");
    }

    if (invite.email !== user.email) {
      throw new BadRequestError("This invite was sent to a different email address");
    }

    if (invite.expiresAt < new Date()) {
      throw new BadRequestError("Invite expired");
    }

    const alreadyMember = await isUserAlreadyMember(
      invite.workspaceId,
      user.id
    );

    if (alreadyMember) {
      throw new BadRequestError("Already member of workspace");
    }

    await addUserToWorkspace(
      invite.workspaceId,
      user.id,
      invite.role
    );

    await deleteInvite(invite.id);

    new SuccessResponse('Invite accepted successfully',{workspaceId: invite.workspaceId}).send(res);
  }
);

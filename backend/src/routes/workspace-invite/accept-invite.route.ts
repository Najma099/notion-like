import { Router } from 'express';
import authentication from '../auth/authentication';
import { isWorkspaceMember } from '../../middleware/workspacePermission';
import { isAdmin } from '../../middleware/isAdmin';
import { sendInvite } from '../../controllers/invite.controller';
import { acceptWorkspaceInvite } from '../../controllers/inviteaccept.controller';
import {
    addUserToWorkspace,
    deleteInvite,
    findInviteByToken,
    isUserAlreadyMember,
} from '../../database/repository/workspaceInvite';
import { AuthFailureError, BadRequestError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { ProtectedRequest } from '../../types/app-requests';
import { asyncHandler } from '../../core/asyncHandler';

const router = Router({ mergeParams: true });


router.post(
    '/:token/accept',
    authentication,
    asyncHandler<ProtectedRequest>(async (req, res): Promise<void> => {
        const token = Array.isArray(req.params.token)
            ? req.params.token[0]
            : req.params.token;

        const user = req.user;
        if (!user) {
            throw new AuthFailureError('Please login to accept invite');
        }

        const invite = await findInviteByToken(token);
        if (!invite) {
            throw new BadRequestError('Invalid invite link');
        }

        if (invite.email !== user.email) {
            throw new BadRequestError(
                'This invite was sent to a different email address',
            );
        }

        if (invite.expiresAt < new Date()) {
            throw new BadRequestError('Invite expired');
        }

        const alreadyMember = await isUserAlreadyMember(
            invite.workspaceId,
            user.id,
        );

        if (alreadyMember) {
            throw new BadRequestError('Already member of workspace');
        }

        await addUserToWorkspace(invite.workspaceId, user.id, invite.role);

        await deleteInvite(invite.id);

        new SuccessResponse('Invite accepted successfully', {
            workspaceId: invite.workspaceId,
        }).send(res);
    }),
);

export default router;

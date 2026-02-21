import { Router } from 'express';
import authentication from '../auth/authentication';
import { isWorkspaceMember } from '../../middleware/workspacePermission';
import { isAdmin } from '../../middleware/isAdmin';
import { sendInvite } from '../../controllers/invite.controller';
import { acceptWorkspaceInvite } from '../../controllers/inviteaccept.controller';

const router = Router({ mergeParams: true });

router.post('/', authentication, isWorkspaceMember, isAdmin, sendInvite);
router.post('/:token/accept', authentication, acceptWorkspaceInvite);

export default router;

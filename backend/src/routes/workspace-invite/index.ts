import { Router } from 'express';
import acceptInviteRoutes from './accept-invite.route';
import sendInviteRoutes from './send-invite.routes';

const router = Router({ mergeParams: true });

router.use('/:workspaceId/send', sendInviteRoutes);
router.use('/', acceptInviteRoutes);

export default router;

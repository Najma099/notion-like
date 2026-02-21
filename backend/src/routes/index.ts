import { Router } from 'express';
import authRoutes from "./auth";
import workspacesRoute from './workspaces'
import blockRoute from './workspaces/blocks.route';
import inviteRoute from './workspace-invite';

const router = Router({ mergeParams: true });

router.use('/workspace-invites', inviteRoute);
router.use('/workspaces', workspacesRoute);
router.use('/pages/:pageId/blocks', blockRoute);
router.use('/auth', authRoutes);

export default router;
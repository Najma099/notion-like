import { Router } from 'express';
import authRoutes from "./auth";
import workspacesRoute from './workspaces'
import blockRoute from './workspaces/blocks.route';

const router = Router({ mergeParams: true });
router.use('/auth', authRoutes);
router.use('/pages/:pageId/blocks', blockRoute);
router.use('/workspaces', workspacesRoute);

export default router;
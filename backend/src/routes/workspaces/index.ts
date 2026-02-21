// workspace/:workspaceid/user
//.     post(add user into the workspace)
//.     get(to see if the particular user is part of the above workspace)
//      delete(the prsn from the above workspace)

import { Router } from 'express';
import workspaceRouter from './workspace.route';
import workspaceIdRouter from './workspaceId.route';
import pagesRoute from './pages.route';


const router = Router({ mergeParams: true });
router.use('/:workspaceId/pages', pagesRoute);
router.use('/:workspaceId', workspaceIdRouter);
router.use('/', workspaceRouter);

export default router;

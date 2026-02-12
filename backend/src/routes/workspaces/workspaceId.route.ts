import { Router } from 'express';
import authentication from '../auth/authentication';
import { isWorkspaceMember } from '../../middleware/workspacePermission';
import { asyncHandler } from '../../core/asyncHandler';
import { ProtectedRequest } from '../../types/app-requests';
import { ForbiddenError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import * as WorkspaceRepo from '../../database/repository/workspace.repo';
import * as WorkspaceIdRepo from '../../database/repository/pages.repo';
const router = Router({ mergeParams: true });


router.get(
    '/',
    authentication,
    isWorkspaceMember,
    asyncHandler(async(req: ProtectedRequest, res) => {
        const workspaceId = Number(req.params.workspaceId);   
        const data = await WorkspaceIdRepo.getWorkspaceData(workspaceId);
        new SuccessResponse('Workspace and pages fetched', data).send(res);
    })
); 

router.patch(
    '/',
    authentication,
    isWorkspaceMember,
    asyncHandler( async(req: ProtectedRequest, res) => {
        if(req.userRole !== 'ADMIN' ) {
            throw new ForbiddenError("Only Admin can rename the workspace");
        }

        const { name } = req.body;
        const workspaceId = Number(req.params.workspaceId);

        const updated = await WorkspaceRepo.updateWorkspace(workspaceId, name);
        new SuccessResponse('Workspcae updated',updated).send(res);
    })
);

router.delete(
    '/',
    authentication,
    isWorkspaceMember,
    asyncHandler( async(req: ProtectedRequest, res) => {
        if (req.userRole !== 'ADMIN') {
            throw new ForbiddenError("Only admins can delete the workspace");
        }
        const workspaceId = Number(req.params.workspaceId);
        await WorkspaceRepo.deleteWorkspace(workspaceId);
        new SuccessResponse('Workspace deleted successfully!', {}).send(res);
    })
);

router.post(
    '/pages',
    authentication,
    isWorkspaceMember,
    asyncHandler(async (req: ProtectedRequest, res) => {
        if (req.userRole === 'VIEWER') {
            throw new ForbiddenError("Viewers cannot create pages");
        }

        const workspaceId = Number(req.params.workspaceId);
        const { title, parentPageId } = req.body;

        const newPage = await WorkspaceIdRepo.createPage(
            workspaceId, 
            req.user.id, 
            title, 
            parentPageId
        );

        new SuccessResponse('Page created successfully', newPage).send(res);
    })
);

export default router;
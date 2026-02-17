import { Router} from 'express';
import authentication from '../auth/authentication';
import { isWorkspaceMember } from '../../middleware/workspacePermission';
import { asyncHandler } from '../../core/asyncHandler';
import { ProtectedRequest } from '../../types/app-requests';
import * as Repo from '../../database/repository/pages.repo'
import { SuccessResponse } from '../../core/ApiResponse';
import { ForbiddenError, NotFoundError } from '../../core/ApiError';
const router = Router({mergeParams: true});

router.get(
    '/',
    authentication,
    isWorkspaceMember,
    asyncHandler(async(req:ProtectedRequest, res) => {
        const workspaceId = Number(req.params.workspaceId);
        const pages = await Repo.getPagesByWorkspace(workspaceId);
        new SuccessResponse('Pages fetched successfully', pages).send(res);
    })
) 

router.post(
    '/',
    authentication,
    isWorkspaceMember,
    asyncHandler( async(req:ProtectedRequest, res) => {
        if(req.userRole == 'VIEWER') {
            throw new ForbiddenError('Viewers cannot create page');
        }

        const workspaceId = Number(req.params.workspaceId);
        const { title, parentPageId} = req.body;

        const page = await Repo.createPage(
            workspaceId,
            req.user.id,
            title,
            parentPageId
        )

        new SuccessResponse('Page updates successfully', page).send(res);
    })
)

router.get(
    '/:pageId',
    authentication,
    isWorkspaceMember,
    asyncHandler(async(req:ProtectedRequest, res) => {
        const pageId = Number(req.params.pageId);
        const workspaceId = Number(req.params.workspaceId);

        const page = await Repo.getPageById(pageId);
        if(!page || page.workspaceId !== workspaceId) {
            throw new NotFoundError('Page not found');
        }

        new SuccessResponse('Page fetched successfully',page).send(res);
    })
)

router.patch(
    '/:pageId',
    authentication,
    isWorkspaceMember,
    asyncHandler(async(req:ProtectedRequest, res) => {
        if (req.userRole === 'VIEWER') {
            throw new ForbiddenError('Viewers cannot edit pages');
        }
        const pageId = Number(req.params.pageId);
        const { title, parentPageId, icon, coverImage } = req.body;

        const updated = await Repo.updatePage(pageId, {title, parentPageId, icon, coverImage});
        new SuccessResponse('Page updated successfully', updated).send(res);
    })
)

router.delete(
    '/:pageId',
    authentication,
    isWorkspaceMember,
    asyncHandler(async(req:ProtectedRequest, res) => {
        if(req.userRole !== 'ADMIN') {
            throw new ForbiddenError('Only admin can delete the page');
        }

        const pageId = Number(req.params.pageId);
        await Repo.deletePage(pageId);
        new SuccessResponse('Page delete successfully',{}).send(res);
    })
)
export default router;
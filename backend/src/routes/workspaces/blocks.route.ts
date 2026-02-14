import { Router } from "express";
import authentication from "../auth/authentication";
import { isPageMember } from "../../middleware/pagePermission";
import { asyncHandler } from "../../core/asyncHandler";
import { ProtectedRequest } from "../../types/app-requests";
import * as BlockRepo from '../../database/repository/block.repo'
import { SuccessResponse } from "../../core/ApiResponse";
import { ForbiddenError } from "../../core/ApiError";

const router = Router({mergeParams: true});

router.get(
    '/',
    authentication,
    isPageMember,
    asyncHandler(async(req:ProtectedRequest, res) => {
        const pageId = Number(req.params.pageId);
        const blocks = await BlockRepo.getBlockByPageId(pageId);
        new SuccessResponse('Block fetched',blocks).send(res);
    })
);

router.post(
    '/',
    authentication,
    isPageMember,
    asyncHandler( async(req:ProtectedRequest, res) => {
        if(req.userRole == 'VIEWER') {
            throw new ForbiddenError("Viewer cannot create blocks!");
        }

        const pageId = Number(req.params.pageId);
        const {type, content, position} = req.body;

        const block = await BlockRepo.createBlock(
            pageId,
            type,
            content,
            position
        );

        new SuccessResponse('Block created', block).send(res);
    })
);

router.patch(
    '/',
    authentication,
    isPageMember,
    asyncHandler(async (req: ProtectedRequest, res) => {
    if (req.userRole === 'VIEWER') {
      throw new ForbiddenError('Viewers cannot reorder blocks');
    }

    const pageId = Number(req.params.pageId);
    const { order } = req.body;

    await BlockRepo.reorderBlocks(pageId, order);

    new SuccessResponse('Blocks reordered', {}).send(res);
  })
);

router.patch(
    '/:blockId',
    authentication,
    isPageMember,
    asyncHandler( async(req:ProtectedRequest, res) => {
        if (req.userRole === 'VIEWER') {
            throw new ForbiddenError('Viewers cannot edit blocks');
        }

        const blockId = Number(req.params.blockId);
        const { content } = req.body;

        const updated = await BlockRepo.updateBlock(blockId, content);

        new SuccessResponse('Block updated', updated).send(res);
    })
);

router.delete(
  '/:blockId',
  authentication,
  isPageMember,
  asyncHandler(async (req: ProtectedRequest, res) => {
    if (req.userRole === 'VIEWER') {
      throw new ForbiddenError('Viewers cannot delete blocks');
    }

    const blockId = Number(req.params.blockId);
    await BlockRepo.deleteBlock(blockId);

    new SuccessResponse('Block deleted', {}).send(res);
  })
);

export default router;
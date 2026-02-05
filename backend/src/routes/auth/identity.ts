import { Router } from 'express';
import { asyncHandler } from "../../core/asyncHandler";
import { ProtectedRequest } from "../../types/app-requests";
import {SuccessResponse } from "../../core/ApiResponse";
import authMiddleware from "./authentication";


const router = Router();

router.use(authMiddleware);

router.get(
    '/',
    asyncHandler<ProtectedRequest>(async (req, res) => {
        new SuccessResponse('User Information.', {
            user: req.user
        }).send(res);
    })   
);

export default router;
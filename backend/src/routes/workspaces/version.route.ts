import { Router } from "express";
import authentication from '../auth/authentication';
import {
  listVersions,
  getVersion,
  restoreVersion,
  saveVersion,
} from "../../controllers/pageversion.controller";
import { isAdmin } from "../../middleware/isAdmin";

const router = Router({ mergeParams: true });
router.get("/", authentication, listVersions);
router.post("/", authentication,saveVersion);
router.get("/:versionId", authentication,getVersion);
router.post("/:versionId/restore",authentication, isAdmin,restoreVersion);

export default router;

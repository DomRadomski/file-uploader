import { Router } from "express";

import * as fileController from "../controllers/fileController.js";
import { ensureAuthenticated } from "../config/authMiddleware.js";
import { upload } from "../config/multer.js";

const router = Router();

router.get("/upload", ensureAuthenticated, fileController.getUploadForm);
router.post(
  "/upload",
  ensureAuthenticated,
  upload.single("file"),
  fileController.postUpload
);

export default router;
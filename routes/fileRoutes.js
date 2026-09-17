import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import { ensureAuthenticated } from "../config/authMiddleware.js";
import { ensureFileOwnership } from "../config/ensureFileOwnership.js";
import { upload } from "../config/multer.js";

const router = Router();

router.use(ensureAuthenticated);

router.get("/upload", fileController.getUploadForm);
router.post("/upload", upload.single("file"), fileController.postUpload);

router.get("/:id", ensureFileOwnership, fileController.show);
router.get("/:id/download", ensureFileOwnership, fileController.download);

export default router;
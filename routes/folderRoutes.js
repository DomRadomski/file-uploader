import { Router } from "express";
import * as folderController from "../controllers/folderController.js";
import { ensureAuthenticated } from "../config/authMiddleware.js";
import { ensureFolderOwnership } from "../config/ensureFolderOwnership.js";
import { upload } from "../config/multer.js";
import * as fileController from "../controllers/fileController.js";
import * as shareController from "../controllers/shareController.js";

const router = Router();

router.use(ensureAuthenticated); // every folder route requires login

router.get("/", folderController.index);
router.get("/create", folderController.newForm);
router.post("/create", folderController.create);

router.get("/:id", ensureFolderOwnership, folderController.show);
router.get("/:id/update", ensureFolderOwnership, folderController.editForm);
router.post("/:id/update", ensureFolderOwnership, folderController.update);
router.post("/:id/delete", ensureFolderOwnership, folderController.destroy);

router.post(
  "/:id/upload",
  ensureFolderOwnership,
  upload.single("file"),
  fileController.postUploadToFolder
);

router.post("/:id/share", ensureFolderOwnership, shareController.createShare);

export default router;
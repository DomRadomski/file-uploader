import { Router } from "express";
import * as shareController from "../controllers/shareController.js";

const router = Router();

router.get("/:urlCode", shareController.show);

export default router;
import { Router } from "express";
import * as authController from "../controllers/authController.js";

import { ensureAuthenticated } from "../config/authMiddleware.js";

const router = Router();

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/logout", authController.getLogout);
router.post("/logout", authController.postLogout);

router.get("/dashboard", ensureAuthenticated, authController.getDashboard);

export default router;
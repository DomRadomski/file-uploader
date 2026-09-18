import { Router } from "express";
import { body, validationResult } from "express-validator";

import passport from "../config/passport.js";
import * as authController from "../controllers/authController.js";
import { ensureAuthenticated } from "../config/authMiddleware.js";



const router = Router();

const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3–30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

const loginValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.get("/register", authController.getRegister);
router.post("/register", registerValidation, authController.postRegister);

router.get("/login", authController.getLogin);
router.post(
  "/login",
  loginValidation,
  authController.postLogin,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/logout", authController.getLogout);
router.post("/logout", authController.postLogout);

router.get("/dashboard", ensureAuthenticated, authController.getDashboard);

export default router;
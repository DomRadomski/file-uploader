import express from "express";
import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import { prisma } from "../lib/prisma.js";

const router = express.Router();


// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.redirect("/login");
  } catch (err) {
    next(err);
  }
});

// Login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;


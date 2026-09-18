import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { prisma } from "../lib/prisma.js";

// GET /register
export function getRegister(req, res) {
  res.render("register", { error: null });
}

// POST /register
export async function postRegister(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", { error: errors.array()[0].msg });
    }

    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.render("register", { error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashedPassword } });

    res.redirect("/login");
  } catch (err) {
    next(err);
  }
}

// GET /login
export function getLogin(req, res) {
  res.render("login", { error: null });
}

// POST /login — runs loginValidation first, then this
export function postLogin(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("login", { error: errors.array()[0].msg });
  }
  next(); // hand off to passport.authenticate
}

// GET /logout
export function getLogout(req, res) {
  res.render("logout");
}

// POST /logout
export function postLogout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

// GET /dashboard
export async function getDashboard(req, res, next) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });

    const looseFiles = await prisma.file.findMany({
      where: { userId: req.user.id, folderId: null },
    });

    res.render("dashboard", { user: req.user, folders, looseFiles });
  } catch (err) {
    next(err);
  }
}
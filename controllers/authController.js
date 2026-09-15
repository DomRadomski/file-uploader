import bcrypt from "bcryptjs";
import passport from "../config/passport.js";
import { prisma } from "../lib/prisma.js";

// GET /register
export function getRegister(req, res) {
  res.render("register", { error: null });
}

// POST /register
export async function postRegister(req, res, next) {
  try {
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

// POST /login
export const postLogin = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
});

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
export function getDashboard(req, res) {
  res.render("dashboard", { user: req.user });
}
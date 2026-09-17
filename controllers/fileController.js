import { prisma } from "../lib/prisma.js";

// GET /upload
export function getUploadForm(req, res) {
  res.render("upload", { error: null });
}

// POST /upload
export async function postUpload(req, res, next) {
  try {
    if (!req.file) {
      return res.render("upload", { error: "Please choose a file" });
    }

    await prisma.file.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        userId: req.user.id,
      },
    });

    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
}
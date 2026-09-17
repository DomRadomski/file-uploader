import { prisma } from "../lib/prisma.js";

// GET /folders
export async function index(req, res, next) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });
    res.render("folders/index", { folders });
  } catch (err) {
    next(err);
  }
}

// GET /folders/create
export function newForm(req, res) {
  res.render("folders/create", { error: null });
}

// POST /folders/create
export async function create(req, res, next) {
  try {
    const { name } = req.body;
    await prisma.folder.create({
      data: { name, userId: req.user.id },
    });
    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
}

// GET /folders/:id
export async function show(req, res, next) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: req.folder.id },
      include: { files: true },
    });
    res.render("folders/show", { folder });
  } catch (err) {
    next(err);
  }
}

// GET /folders/:id/update
export function editForm(req, res) {
  res.render("folders/update", { folder: req.folder, error: null });
}

// POST /folders/:id/update
export async function update(req, res, next) {
  try {
    const { name } = req.body;
    await prisma.folder.update({
      where: { id: req.folder.id },
      data: { name },
    });
    res.redirect(`/folders/${req.folder.id}`);
  } catch (err) {
    next(err);
  }
}

import fs from "node:fs/promises";

// POST /folders/:id/delete
export async function destroy(req, res, next) {
  try {
    const files = await prisma.file.findMany({
      where: { folderId: req.folder.id },
    });

    // Remove the actual files from disk first
    await Promise.all(
      files.map((file) =>
        fs.unlink(file.path).catch((err) => {
          // Log and continue rather than aborting the whole deletion
          // if one file's already missing from disk somehow
          console.error(`Failed to delete ${file.path}:`, err.message);
        })
      )
    );

    // Then remove the DB records and the folder itself
    await prisma.$transaction([
      prisma.file.deleteMany({ where: { folderId: req.folder.id } }),
      prisma.folder.delete({ where: { id: req.folder.id } }),
    ]);

    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
}
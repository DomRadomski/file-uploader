import { prisma } from "../lib/prisma.js";
import { supabase } from "../config/supabase.js";

// GET /upload
export function getUploadForm(req, res) {
  res.render("upload", { error: null });
}

// POST /files/upload
export async function postUpload(req, res, next) {
  try {
    if (!req.file) {
      return res.render("upload", { error: "Please choose a file" });
    }

    const uniqueName = `${Date.now()}-${req.file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("user-files")
      .upload(uniqueName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("user-files")
      .getPublicUrl(uniqueName);

    await prisma.file.create({
      data: {
        filename: uniqueName,
        originalName: req.file.originalname,
        url: data.publicUrl,
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

// POST /folders/:id/upload
export async function postUploadToFolder(req, res, next) {
  try {
    if (!req.file) {
      return res.redirect(`/folders/${req.folder.id}`);
    }

    const uniqueName = `${Date.now()}-${req.file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("user-files")
      .upload(uniqueName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("user-files")
      .getPublicUrl(uniqueName);

    await prisma.file.create({
      data: {
        filename: uniqueName,
        originalName: req.file.originalname,
        url: data.publicUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
        userId: req.user.id,
        folderId: req.folder.id,
      },
    });

    res.redirect(`/folders/${req.folder.id}`);
  } catch (err) {
    next(err);
  }
}

// GET /files/:id
export function show(req, res) {
  res.render("files/show", { file: req.fileRecord });
}

// GET /files/:id/download
export function download(req, res) {
  const downloadUrl = `${req.fileRecord.url}?download=${encodeURIComponent(req.fileRecord.originalName)}`;
  res.redirect(downloadUrl);
}

// POST /folders/:id/delete
export async function destroy(req, res, next) {
  try {
    const files = await prisma.file.findMany({
      where: { folderId: req.folder.id },
    });

    // Remove the actual files from Supabase storage first
    if (files.length > 0) {
      const { error: removeError } = await supabase.storage
        .from("user-files")
        .remove(files.map((f) => f.filename));

      if (removeError) {
        console.error("Failed to remove files from storage:", removeError.message);
      }
    }

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
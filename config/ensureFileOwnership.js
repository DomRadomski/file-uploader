import { prisma } from "../lib/prisma.js";

export async function ensureFileOwnership(req, res, next) {
  try {
    const file = await prisma.file.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!file) {
      return res.status(404).send("File not found");
    }

    if (file.userId !== req.user.id) {
      return res.status(403).send("Not your file");
    }

    req.fileRecord = file;
    next();
  } catch (err) {
    next(err);
  }
}
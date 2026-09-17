import { prisma } from "../lib/prisma.js";

export async function ensureFolderOwnership(req, res, next) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!folder) {
      return res.status(404).send("Folder not found");
    }

    if (folder.userId !== req.user.id) {
      return res.status(403).send("Not your folder");
    }

    req.folder = folder; // pass it along so the controller doesn't re-fetch it
    next();
  } catch (err) {
    next(err);
  }
}
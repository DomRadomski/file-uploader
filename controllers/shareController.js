import { prisma } from "../lib/prisma.js";

const DURATIONS = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

// POST /folders/:id/share
export async function createShare(req, res, next) {
  try {
    const durationMs = DURATIONS[req.body.duration] ?? DURATIONS["24h"];
    const expiresAt = new Date(Date.now() + durationMs);

    const share = await prisma.share.create({
      data: { folderId: req.folder.id, expiresAt },
    });

    res.redirect(`/folders/${req.folder.id}?shared=${share.urlCode}`);
  } catch (err) {
    next(err);
  }
}

// GET /share/:urlCode
export async function show(req, res, next) {
  try {
    const share = await prisma.share.findUnique({
      where: { urlCode: req.params.urlCode },
      include: { folder: { include: { files: true } } },
    });

    if (!share) {
      return res.status(404).render("share-error", {
        message: "This share link doesn't exist.",
      });
    }

    if (share.expiresAt < new Date()) {
      return res.status(410).render("share-error", {
        message: "This share link has expired.",
      });
    }

    res.render("share-view", { folder: share.folder });
  } catch (err) {
    next(err);
  }
}
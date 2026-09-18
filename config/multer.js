import multer from "multer";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
];

function fileFilter(req, file, cb) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Unsupported file type"));
  }
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import fs from "node:fs";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const uploadsDir = path.join(__dirname, "..", "uploads");

// // Multer's diskStorage destination callback expects the folder to exist —
// // it won't create it for you.
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     // Prefix with a timestamp so two different users uploading
//     // "resume.pdf" don't overwrite each other on disk.
//     const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `${file.originalname}-${uniquePrefix}`);
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB cap, adjust as needed
// });
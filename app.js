// app.js
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { sessionMiddleware } from "./config/session.js";
import passport from "./config/passport.js";

import authRouter from "./routes/authRoutes.js";
import fileRouter from "./routes/fileRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// For CSS
// const assetsPath = path.join(__dirname, "public");
// app.use(express.static(assetsPath));

// Useful for parsing form bodies
app.use(express.urlencoded({ extended: true }));

// Session + auth — must come after body parsing, before routes
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// View stuff
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(authRouter);
app.use(fileRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the homepage my driller");
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
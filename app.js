// app.js
const path = require("node:path");
const express = require("express");

const app = express();

// For CSS
// const assetsPath = path.join(__dirname, "public");
// app.use(express.static(assetsPath));

// Useful for parsing 
app.use(express.urlencoded({ extended: true }));

// View stuff
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Welcome to the homepage my driller")
});

const PORT = 6969;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
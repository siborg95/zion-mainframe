import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve the built SPA from /dist
const distPath = path.join(__dirname, "dist");
app.get("/console", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
app.get("/console.html", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
app.use(express.static(distPath));

// SPA fallback so deep links like /console work
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend listening on ${PORT}`);
});



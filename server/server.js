const express = require("express");
const path = require("path");
const cors = require("cors");
const OpenAI = require("openai");

const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Simple login (demo)
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === "administrator" && password === "NewSecurePass123") {
    return res.json({ ok: true, token: "fake-jwt-token" });
  }
  return res.status(401).json({ ok: false, error: "invalid_credentials" });
});

// GPT bridge
app.post("/gpt", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ ok: false, error: "missing_prompt" });

    const r = await ai.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    res.json({ ok: true, text: r.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "openai_error" });
  }
});

// Serve built SPA (dist is one level up from /server)
const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => console.log(`API listening on ${PORT}`));

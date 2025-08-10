// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

// --- env
const API_KEY = process.env.OPENAI_API_KEY;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const PORT = process.env.PORT || 8080;

if (!API_KEY) {
  console.warn("[WARN] OPENAI_API_KEY is not set");
}

const app = express();
app.use(express.json());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

// --- health
app.get("/health", (_req, res) => res.json({ ok: true }));

// --- demo login
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === "administrator" && password === "NewSecurePass123") {
    return res.json({ ok: true, token: "fake-jwt-token" });
  }
  return res.status(401).json({ ok: false, error: "invalid_credentials" });
});

// --- GPT bridge (Responses API)
app.post("/gpt", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ ok: false, error: "missing_prompt" });
    if (!API_KEY) return res.status(500).json({ ok: false, error: "missing_api_key" });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt
      })
    }).catch((e) => { throw new Error(`fetch_failed: ${e.message}`); });

    clearTimeout(timer);

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("OpenAI HTTP", r.status, data);
      return res.status(502).json({ ok: false, error: "openai_http_error", status: r.status });
    }

    const text = data.output_text || ""; // Responses API
    return res.json({ ok: true, text });
  } catch (err) {
    console.error("GPT route error:", err?.message || err);
    return res.status(500).json({ ok: false, error: "openai_error" });
  }
});

// (Optional) serve SPA if this repo also builds your frontend into /dist
const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on ${PORT}`);
});

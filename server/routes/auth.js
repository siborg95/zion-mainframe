// server/routes/auth.js  (CommonJS, no DB)
const express = require("express");
const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, status: "Backend is running" });
});

router.post("/login", express.json(), (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Missing credentials" });
  }
  // TODO: replace with real auth later
  const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
  res.json({ ok: true, token });
});

module.exports = router;

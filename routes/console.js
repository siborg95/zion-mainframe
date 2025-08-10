// routes/console.js (ESM)
import express from "express";
const router = express.Router();

const HISTORY_LIMIT = 50;
const history = [];
const push = (role, text) => {
  const t = new Date().toISOString().split("T")[1].replace("Z", "");
  history.push({ role, text, time: t });
  if (history.length > HISTORY_LIMIT) history.shift();
};

router.get("/console/ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));
router.get("/console/history", (_req, res) => res.json({ ok: true, items: history }));

router.post("/console", express.json(), (req, res) => {
  const msg = String(req.body?.message || "").trim();
  if (!msg) return res.status(400).json({ ok: false, error: "Empty message" });
  push("user", msg);

  let reply;
  if (msg === "/help") reply = ["Commands:", " /help", " /time", " /status", " <text> – echo"].join("\n");
  else if (msg === "/time") reply = `Server time: ${new Date().toISOString()}`;
  else if (msg === "/status") reply = "OK: console route live.";
  else {
    const words = msg.split(/\s+/).filter(Boolean).length;
    reply = `Echo: "${msg}" (words=${words})`;
  }

  push("assistant", reply);
  res.json({ ok: true, reply });
});

export default router;

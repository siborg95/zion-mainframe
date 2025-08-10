// server/server.js  (CommonJS)
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");       // /auth/login, /auth/health
const consoleRouter = require("./routes/console"); // /console, /console/ping, /console/history

const app = express();

// global middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// mount routes
app.use("/auth", authRouter);   // -> /auth/login
app.use("/", consoleRouter);    // -> /console, /console/ping

// health
app.get("/", (_req, res) => res.json({ ok: true, service: "backend" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on ${PORT}`);
});

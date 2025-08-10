const express = require("express");
const cors = require("cors");
const consoleRouter = require("./routes/console"); // inside server/routes

const app = express();

// global middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// mount console endpoints
app.use("/", consoleRouter);

// health
app.get("/", (_req, res) => res.json({ ok: true, service: "backend" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on ${PORT}`);
});

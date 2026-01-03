require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { WebSocketServer } = require("ws");
const connectDB = require("./config/db");
const Event = require("./models/Event");

connectDB();

const PORT = process.env.PORT || 3333;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("tiny"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const rooms = new Map();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const code = url.searchParams.get("code");
  if (!code) {
    ws.close(1008, "Code is required");
    return;
  }
  if (!rooms.has(code)) {
    rooms.set(code, new Set());
  }
  rooms.get(code).add(ws);

  ws.on("close", () => {
    rooms.get(code)?.delete(ws);
    if (rooms.get(code)?.size === 0) {
      rooms.delete(code);
    }
  });
});

function broadcast(code, data) {
  const msg = JSON.stringify(data);
  const room = rooms.get(code);
  if (room) {
    room.forEach((client) => client.send(msg));
  }
}

app.get("/", (req, res) => {
  res.send("Live Image Server is running");
});

app.post("/send", async (req, res) => {
  const { url, code, settings, meta } = req.body;

  if (url === undefined || url === null) {
    return res.status(400).send({ error: "Missing url" });
  }
  if (!code) {
    return res.status(400).send({ error: "Missing code" });
  }

  // Save event to database
  try {
    await Event.create({ code, url, settings, meta });
  } catch (error) {
    console.error("Error saving event to database:", error);
  }

  broadcast(code, { url, settings });
  return res.send({ ok: true });
});

server.listen(PORT, () => {
  console.log(`HTTP + WS server running on http://localhost:${PORT}`);
});

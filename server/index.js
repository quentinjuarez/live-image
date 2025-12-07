require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { WebSocketServer } = require("ws");

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
  const roomId = url.searchParams.get("id");
  if (!roomId) {
    ws.close(1008, "Room ID is required");
    return;
  }
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(ws);

  ws.on("close", () => {
    rooms.get(roomId)?.delete(ws);
    if (rooms.get(roomId)?.size === 0) {
      rooms.delete(roomId);
    }
  });
});

function broadcast(roomId, data) {
  const msg = JSON.stringify(data);
  const room = rooms.get(roomId);
  if (room) {
    room.forEach((client) => client.send(msg));
  }
}

app.get("/", (req, res) => {
  res.send("Live Image Server is running");
});

app.post("/send", (req, res) => {
  const { image, roomId } = req.body;

  if (!image) {
    return res.status(400).send({ error: "Missing image" });
  }
  if (!roomId) {
    return res.status(400).send({ error: "Missing roomId" });
  }

  broadcast(roomId, { image });
  return res.send({ ok: true });
});

server.listen(PORT, () => {
  console.log(`HTTP + WS server running on http://localhost:${PORT}`);
});

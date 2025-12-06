require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { WebSocketServer } = require("ws");

const SERVER_PORT = process.env.SERVER_PORT || 3333;
const WS_PORT = process.env.WS_PORT || 3334;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("tiny"));

const wss = new WebSocketServer({ port: WS_PORT });
console.log("WS Server running on ws://localhost:" + WS_PORT);

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

app.listen(SERVER_PORT, () =>
  console.log("HTTP server running on http://localhost:" + SERVER_PORT)
);

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

// --- WEBSOCKET SERVER ---
const wss = new WebSocketServer({ port: WS_PORT });
console.log("WS Server running on ws://localhost:" + WS_PORT);

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => client.send(msg));
}

// --- API HTTP ---
app.post("/send", (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send({ error: "Missing image" });
  }

  broadcast({ image });
  return res.send({ ok: true });
});

app.listen(SERVER_PORT, () =>
  console.log("HTTP server running on http://localhost:" + SERVER_PORT)
);

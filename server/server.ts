import { Server, WebSocket } from "ws";
import { v4 } from "uuid";

const wss = new Server({ port: 8080 });
const clients = new Map<
  WebSocket,
  {
    id: string;
    color: number;
  }
>();

wss.on("connection", (ws) => {
  const id = v4();
  const color = Math.floor(Math.random() * 360);
  const metadata = { id, color };

  clients.set(ws, metadata);
  console.log("connected");

  ws.on("message", (rawMessage) => {
    const message = JSON.parse(rawMessage.toString());
    const metadata = clients.get(ws);

    message.sender = metadata?.id;
    message.color = metadata?.color;

    const outbound = JSON.stringify(message);

    [...clients.keys()].forEach((client) => {
      client.send(outbound);
    });
  });

  ws.on("close", () => {
    clients.delete(ws);
  });
});

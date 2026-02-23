import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Server } from "http";
import {
  ClientMeta,
  joinRoom,
  leaveRoom,
  broadcastToRoom,
  getUserColor,
} from "./room";
import { handleMessage } from "./wsHandler";
import JWT, { AccessTokenPayload } from "../core/jwtUtils";
import {validateAccessToken}  from "../core/authUtils"; 

interface JoinMessage {
  type: "join";
  pageId: string;
  workspaceId: string;
  userId: string;
  tabId: string;
  name: string;
  token: string;
}

export async function initWsServer(httpServer: Server):Promise<void> {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket, _req: IncomingMessage) => {
    let client: ClientMeta | null = null;

    const joinTimeout = setTimeout(() => {
      if (!client) ws.close(4001, "Did not join in time");
    }, 5000);

    ws.on("message", async (data: Buffer) => {
      const raw = data.toString();

      if (!client) {
        try {
          const msg: JoinMessage = JSON.parse(raw);

          if (msg.type !== "join") {
            ws.close(4002, "First message must be join");
            return;
          }

            let decoded: AccessTokenPayload;
            try {
            decoded = await JWT.validate(msg.token) as unknown as AccessTokenPayload;
            validateAccessToken(decoded);
            } catch(err) {
               console.error("WS auth error:", err);
            ws.close(4003, "Unauthorized");
            return;
            }

            if (decoded.sub !== msg.userId) {
            ws.close(4003, "Unauthorized");
            return;
            }

          clearTimeout(joinTimeout);

          client = {
            userId: msg.userId,
            tabId: msg.tabId,
            name: msg.name,
            pageId: msg.pageId,
            workspaceId: msg.workspaceId,
            color: getUserColor(msg.userId),
            ws,
          };

          joinRoom(msg.pageId, client);

          broadcastToRoom(msg.pageId, {
            type: "user_joined",
            userId: client.userId,
            name: client.name,
            color: client.color,
          }, client);

          console.log(`WS: ${client.name} [tab:${client.tabId}] joined page ${client.pageId}`);
        } catch {
          ws.close(4000, "Invalid join message");
        }
        return;
      }

      handleMessage(client, raw);
    });

    ws.on("close", () => {
      if (!client) return;

      const wasLastTab = leaveRoom(client.pageId, client);

      if (wasLastTab) {
        broadcastToRoom(client.pageId, {
          type: "user_left",
          userId: client.userId,
        });
        console.log(`WS: ${client.name} fully left page ${client.pageId}`);
      } else {
        console.log(`WS: ${client.name} closed tab ${client.tabId} (still has other tabs)`);
      }
    });

    ws.on("error", (err) => {
      console.error("WS error:", err.message);
    });
  });

  console.log("WebSocket server initialized on /ws");
}
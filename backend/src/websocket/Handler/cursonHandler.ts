import { ClientMeta, broadcastToRoom } from "../room";

export function handleCursor(client: ClientMeta, payload: { blockId: number }): void {
  broadcastToRoom(client.pageId, {
    type: "cursor_update",
    userId: client.userId,
    name: client.name,
    color: client.color,
    blockId: payload.blockId,
  }, client);
}
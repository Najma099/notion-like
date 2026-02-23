import { ClientMeta, broadcastToRoom } from "../room";

interface DeletePayload {
  blockId: number;
}

export function handleBlockDelete(client: ClientMeta, payload: DeletePayload): void {
  broadcastToRoom(client.pageId, {
    type: "block_deleted",
    blockId: payload.blockId,
  }, client);
}
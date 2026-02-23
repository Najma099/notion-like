import { ClientMeta, broadcastToRoom } from "../room";

interface CreatePayload {
  tempId: number;
  realBlock: Record<string, unknown>;
}

export function handleBlockCreate(client: ClientMeta, payload: CreatePayload): void {
  broadcastToRoom(client.pageId, {
    type: "block_created",
    tempId: payload.tempId,
    realBlock: payload.realBlock,
  }, client);
}
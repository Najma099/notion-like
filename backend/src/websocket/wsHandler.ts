
import { ClientMeta } from "./room";
import { handleCursor } from "./Handler/cursonHandler";
import { handleEdit } from "./Handler/editHandler";
import { handleBlockCreate } from "./Handler/createHandler";
import { handleBlockDelete } from "./Handler/deleteHandler";

interface IncomingMessage {
  type: string;
  [key: string]: unknown;
}

export function handleMessage(client: ClientMeta, raw: string): void {
  let msg: IncomingMessage;

  try {
    msg = JSON.parse(raw);
  } catch {
    console.error("WS: invalid JSON from", client.userId);
    return;
  }

  switch (msg.type) {
    case "block_create":
    handleBlockCreate(client, {
      tempId: msg.tempId as number,
      realBlock: msg.realBlock as Record<string, unknown>,
    });
    break;

  case "block_delete":
    handleBlockDelete(client, {
      blockId: msg.blockId as number,
    });
    break;
    case "cursor":
       handleCursor(client, { blockId: msg.blockId as number });
      break;

    case "edit":
      handleEdit(client, {
        blockId: msg.blockId as number,
        content: msg.content as Record<string, unknown>,
        type: msg.blockType as string | undefined,
      }).catch((err) => console.error("WS: edit handler error", err));
      break;

    default:
      console.warn("WS: unknown message type:", msg.type);
  }
}
"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export interface RemoteCursor {
  userId: string;
  name: string;
  color: string;
  blockId: number | null;
}

export function useCursor(
  send: (msg: Record<string, unknown>) => void, 
  pageId: string
) {
  const { user } = useAuth(); 
  const [cursors, setCursors] = useState<Map<string, RemoteCursor>>(new Map()); 

  const sendCursorToBlock = useCallback(
    (blockId: number) => {
      send({ type: "cursor", pageId, blockId });
    },
    [send, pageId]
  );

  const handleCursorMessage = useCallback(
    (msg: Record<string, unknown>) => {
      if (msg.type === "cursor_update") {
        if (String(msg.userId) === String(user?.id)) return;
        setCursors((prev) => {
          const next = new Map(prev);
          next.set(msg.userId as string, {
            userId: msg.userId as string,
            name: msg.name as string,
            color: msg.color as string,
            blockId: msg.blockId as number,
          });
          return next;
        });
      }
      if (msg.type === "user_left") {
        setCursors((prev) => {
          const next = new Map(prev);
          next.delete(msg.userId as string);
          return next;
        });
      }
    },
    [user?.id]
  );

  return { cursors, sendCursorToBlock, handleCursorMessage };
}
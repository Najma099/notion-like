"use client";

import { useCallback, useRef } from "react";
import { saveVersion } from "../lib/version.api";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/hooks/useAuth";
import { Block } from "@/types/block.type";

const DEBOUNCE_MS = 30_000;

export function useVersionSave(pageId: number) {
  const { activeWorkspace } = useWorkspace();
  const { user } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  
  const scheduleVersionSave = useCallback(
    (blocks: Block[]) => {
      if (!activeWorkspace || !user) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(async () => {
        try {
          await saveVersion(activeWorkspace.id, pageId, blocks);
        } catch {
          console.warn("Version auto-save failed silently");
        }
      }, DEBOUNCE_MS);
    },
    [activeWorkspace, pageId, user]
  );

 
  const flushVersionSave = useCallback(
    async (blocks: Block[]) => {
      if (!activeWorkspace || !user) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      try {
        await saveVersion(activeWorkspace.id, pageId, blocks);
      } catch {
        console.warn("Version flush save failed silently");
      }
    },
    [activeWorkspace, pageId, user]
  );

  return { scheduleVersionSave, flushVersionSave };
}
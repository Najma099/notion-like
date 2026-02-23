"use client";

import { RemoteCursor } from "../hooks/useCursor";


interface CursorOverlayProps {
  cursors: Map<string, RemoteCursor>;
}

export default function CursorOverlay({ cursors }: CursorOverlayProps) {
  if (cursors.size === 0) return null;

  return (
    <>
      {[...cursors.values()].map((cursor) => {
        if (!cursor.blockId) return null;

        const blockEl = document.querySelector(`[data-block-id="${cursor.blockId}"]`);
        if (!blockEl) return null;

        const rect = blockEl.getBoundingClientRect();
        const containerEl = blockEl.closest(".relative.mx-auto");
        const containerRect = containerEl?.getBoundingClientRect();

        const top = rect.top - (containerRect?.top ?? 0);

        return (
          <div
            key={cursor.userId}
            className="pointer-events-none absolute z-50 left-0 right-0 transition-all duration-150"
            style={{ top }}
          >
            <div
              className="absolute right-0 px-1.5 py-0.5 rounded text-[11px] font-medium text-white whitespace-nowrap shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.name}
            </div>
            <div
              className="absolute inset-x-0 h-px opacity-40"
              style={{ backgroundColor: cursor.color }}
            />
          </div>
        );
      })}
    </>
  );
}
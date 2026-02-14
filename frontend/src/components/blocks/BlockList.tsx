"use client";

import { useState } from "react";
import { Block, BlockType } from "@/types/block.type";
import { createBlock } from "@/lib/block.api";
import BlockItem from "./BlockItem";

export default function BlockList({
  blocks,
  loading,
  pageId,
  refetchBlocks,
}: {
  blocks: Block[];
  loading: boolean;
  pageId: number;
  refetchBlocks: () => void;
}) {
  const [newBlockText, setNewBlockText] = useState("");

  const handleCreateBlock = async () => {
    if (!newBlockText.trim()) return;

    try {
      await createBlock(pageId, BlockType.PARAGRAPH, { text: newBlockText }, blocks.length);
      setNewBlockText("");
      refetchBlocks();
    } catch (error) {
      console.error("Failed to create block:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {blocks.map((block) => (
        <BlockItem key={block.id} block={block} />
      ))}

      <textarea
        value={newBlockText}
        onChange={(e) => setNewBlockText(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleCreateBlock();
          }
        }}
        className="w-full border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 outline-none placeholder:text-zinc-400 resize-y max-h-40 overflow-y-auto"
        placeholder="Type something and press Enter..."
        autoFocus
      />
    </div>
  );
}

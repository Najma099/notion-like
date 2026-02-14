"use client";

import { useParams } from "next/navigation";
import { useBlocks } from "@/hooks/useBlock";
import { createBlock } from "@/lib/block.api";
import { BlockType } from '@/types/block.type'

export default function PageBlock() {
  const params = useParams();
  const pageId = Number(params.pageId);

  const { blocks, loading, refetchBlocks } = useBlocks(pageId);
  console.log(blocks);
  async function handleCreateBlock() {
    console.log("Creating blocks");
    await createBlock(pageId,BlockType.PARAGRAPH, { text: "Hello first block" });
    await refetchBlocks();
    console.log("WE called refresheeeeee!");
    console.log(blocks);
  }

  return (
    <div>
      <button onClick={handleCreateBlock}>
        ➕ Add block
      </button>

      {loading && <p>Loading...</p>}

      { blocks && blocks.map(block => (
        <div key={block.id}>
          {block.content?.text}
        </div>
      ))}
    </div>
  );
}

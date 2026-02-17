"use client";

import { Block, BlockType } from "@/types/block.type";
import { createBlock, deleteBlock } from "@/lib/block.api";
import BlockItem from "./BlockItem";
import { toast } from "sonner";

export default function BlockList({
  blocks,
  loading,
  pageId,
  refetchBlocks,
  optimisticUpdateBlock,
  optimisticDeleteBlock,
  optimisticAddBlock,
  setBlocks,
}: {
  blocks: Block[];
  loading: boolean;
  pageId: number;
  refetchBlocks: () => void;
  optimisticUpdateBlock: (blockId: number, updates: Partial<Block>) => void;
  optimisticDeleteBlock: (blockId: number) => void;
  optimisticAddBlock: (newBlock: Block) => void;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}) {

  const handleCreateBelow = async (position: number) => {
    const tempId = -Date.now();
    
    const tempBlock: Block = {
      id: tempId,
      pageId,
      type: BlockType.PARAGRAPH,
      content: { text: "" },
      position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    optimisticAddBlock(tempBlock);

    try {
      const realBlock = await createBlock(pageId, BlockType.PARAGRAPH, { text: "" }, position);
      
      setBlocks(prev => {
        const filtered = prev.filter(b => b.id !== tempId);
        return [...filtered, realBlock].sort((a, b) => a.position - b.position);
      });
    } catch (error) {
      console.error("Failed to create block:", error);
      toast.error("Failed to create block");
      optimisticDeleteBlock(tempId);
    }
  };

  const handleDelete = async (blockId: number) => {
    const deletedBlock = blocks.find(b => b.id === blockId);
    
    optimisticDeleteBlock(blockId);

    try {
      await deleteBlock(pageId, blockId);
    } catch (error) {
      console.error("Failed to delete block:", error);
      toast.error("Failed to delete block");
      
      if (deletedBlock) {
        optimisticAddBlock(deletedBlock);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-zinc-500">Loading blocks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {blocks.length === 0 ? (
        <div 
          className="text-zinc-400 cursor-text py-2 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded transition-colors"
          onClick={() => handleCreateBelow(0)}
        >
          Click here to start writing...
        </div>
      ) : (
        blocks.map((block, index) => (
          <BlockItem
            key={block.id}
            block={block}
            pageId={pageId}
            onUpdate={refetchBlocks}
            onDelete={handleDelete}
            onCreateBelow={handleCreateBelow}
            isFirst={index === 0}
            isLast={index === blocks.length - 1}
            optimisticUpdate={optimisticUpdateBlock}
          />
        ))
      )}
    </div>
  );
}
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
  setBlocks: (blocks: Block[]) => void;
}) {

  const handleCreateBelow = async (position: number) => {
    // Create temporary block for instant UI update
    const tempBlock: Block = {
      id: Date.now(), // Temporary ID
      pageId,
      type: BlockType.PARAGRAPH,
      content: { text: "" },
      position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add immediately to UI
    optimisticAddBlock(tempBlock);

    try {
      // Create on server
      const realBlock = await createBlock(pageId, BlockType.PARAGRAPH, { text: "" }, position);
      
      // Replace temp block with real block
      setBlocks([...blocks.filter(b => b.id !== tempBlock.id), realBlock].sort((a, b) => a.position - b.position));
    } catch (error) {
      console.error("Failed to create block:", error);
      toast.error("Failed to create block");
      // Remove temp block on error
      optimisticDeleteBlock(tempBlock.id);
    }
  };

  const handleDelete = async (blockId: number) => {
    // Store the block in case we need to restore it
    const deletedBlock = blocks.find(b => b.id === blockId);
    
    // Delete immediately from UI
    optimisticDeleteBlock(blockId);

    try {
      // Delete on server
      await deleteBlock(pageId, blockId);
    } catch (error) {
      console.error("Failed to delete block:", error);
      toast.error("Failed to delete block");
      
      // Restore block on error
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
            isLast={index === blocks.length - 1}
            optimisticUpdate={optimisticUpdateBlock}
          />
        ))
      )}
    </div>
  );
}
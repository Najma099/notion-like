"use client";

import { useBlocks } from "../../hooks/useBlock";
import BlockList from "./BlockList";

export default function BlockEditor({ pageId }: { pageId: number }) {
  const { blocks, loading, refetchBlocks } = useBlocks(pageId);

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <BlockList 
        blocks={blocks} 
        loading={loading} 
        pageId={pageId}
        refetchBlocks={refetchBlocks}
      />
    </div>
  );
}

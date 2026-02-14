"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchBlock } from "@/lib/block.api";
import { Block } from "@/types/block.type";

export function useBlocks(pageId?: number) {
  const [blocks, setBlocks] = useState<Block[]>([]); 
  const [loading, setLoading] = useState(false);

  const loadBlocks = useCallback(async () => {
    if (!pageId) return;

    try {
      setLoading(true);
      const data = await fetchBlock(pageId);
      console.log("data", data);
      setBlocks(data); 
      console.log("we have set the blockkk!");
      console.log(blocks);
    } catch (e) {
      console.error("Failed to load blocks", e);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  return {
    blocks,
    loading,
    refetchBlocks: loadBlocks,
  };
}
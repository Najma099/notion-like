import apiClient from "./apiClient";
import { BlockType, BlockContent, Block } from "@/types/block.type";

export async function fetchBlock(pageId: number) {
  const res = await apiClient.get<Block[]>(`/pages/${pageId}/blocks`);
  return res;
}

export function createBlock(
  pageId: number,
  type: BlockType,
  content?: BlockContent,
  position?: number,
) {
    const blockContent = content || { text: "" };
    if (type === "PARAGRAPH" && !blockContent.text) {
        blockContent.text = "";
    }
    return apiClient.post<Block>(`/pages/${pageId}/blocks`, {
        pageId,  
        type,
        content: blockContent,
        position,
    });
}

export function reorderBlocks(
  pageId: number,
  order: { id: number; position: number }[]
) {
  return apiClient.patch(`/pages/${pageId}/blocks`, { order });
}

export function updateBlock(
  pageId: number,
  blockId: number,
  content: BlockContent,
  type?: BlockType
) {
  return apiClient.patch<Block>(`/pages/${pageId}/blocks/${blockId}`, {
    content,
    ...(type && { type })
  });
}

export function deleteBlock(pageId: number, blockId: number) {
  return apiClient.delete(`/pages/${pageId}/blocks/${blockId}`);
}
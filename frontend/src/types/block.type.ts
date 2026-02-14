export enum BlockType {
  PARAGRAPH = "PARAGRAPH",
  TODO = "TODO",
  IMAGE = "IMAGE",
  CODE = "CODE",
  HEADING_1 = "HEADING_1",
  HEADING_2 = "HEADING_2",
}

export type BlockContent = {
  text?: string;
  checked?: boolean;
  url?: string;
  language?: string;
};

export interface Block {
  id: number;
  pageId: number;
  type: BlockType;
  position: number;
  content: BlockContent;
  createdAt: string;
  updatedAt: string;
}
import { BlockType } from '@prisma/client';

export type ParagraphBlock = {
  text: string;
};

export type TodoBlock = {
  text: string;
  checked: boolean;
};

export type ImageBlock = {
  url: string;
  caption?: string;
};

export type CodeBlock = {
  code: string;
  language?: string;
};

export type HeadingBlock = {
  text: string;
};

export type BlockContentMap = {
  [BlockType.PARAGRAPH]: ParagraphBlock;
  [BlockType.TODO]: TodoBlock;
  [BlockType.IMAGE]: ImageBlock;
  [BlockType.CODE]: CodeBlock;
  [BlockType.HEADING_1]: HeadingBlock;
  [BlockType.HEADING_2]: HeadingBlock;
};

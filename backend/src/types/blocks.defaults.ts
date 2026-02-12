import { BlockType } from '@prisma/client';

export function getDefaultBlockContent(type: BlockType) {
  switch (type) {
    case BlockType.PARAGRAPH:
      return { text: '' };

    case BlockType.TODO:
      return { text: '', checked: false };

    case BlockType.IMAGE:
      return { url: '' };

    case BlockType.CODE:
      return { code: '', language: 'plaintext' };

    case BlockType.HEADING_1:
    case BlockType.HEADING_2:
      return { text: '' };

    default:
      throw new Error('Unsupported block type');
  }
}

import { BlockType } from '@prisma/client';

export function validateBlockContent(
  type: BlockType,
  content: any,
) {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid block content');
  }

  switch (type) {
    case BlockType.PARAGRAPH:
    case BlockType.HEADING_1:
    case BlockType.HEADING_2:
      if (typeof content.text !== 'string') {
        throw new Error('Text is required');
      }
      break;

    case BlockType.TODO:
      if (
        typeof content.text !== 'string' ||
        typeof content.checked !== 'boolean'
      ) {
        throw new Error('Invalid TODO block');
      }
      break;

    case BlockType.IMAGE:
      if (typeof content.url !== 'string') {
        throw new Error('Image URL required');
      }
      break;

    case BlockType.CODE:
      if (typeof content.code !== 'string') {
        throw new Error('Code is required');
      }
      break;

    default:
      throw new Error('Unsupported block type');
  }
}

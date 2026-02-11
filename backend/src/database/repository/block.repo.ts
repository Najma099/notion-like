import { prisma } from "..";
import { BlockType } from '@prisma/client';

export async function getBlockByPageId(pageId: number) {
    return prisma.block.findMany({
        where:{
            pageId
        },
        orderBy:{
            position: 'asc'
        }
    });
}

export async function createBlock(pageId: number, type:BlockType, content: unknown, position?: number) {
    return prisma.$transaction(async(tx) => {
        const lastBlock = await tx.block.findFirst({
            where: {pageId},
            orderBy: {position: 'desc'},
            select: {position: true},
        });

        const newPosition = position ?? (lastBlock?.position ?? 0) + 1;
        
        return tx.block.create({
            data: {
                pageId,
                type,
                content,
                position: newPosition,
            },
        });
    })
}

export async function updateBlock(blockId: number, content:unknown) {
    return prisma.block.update({
        where:{
            id: blockId
        },
        data: {
            content
        }
    });
}

export async function deleteBlock(blockId: number) {
  return prisma.block.delete({
    where: { id: blockId },
  });
}


export async function reorderBlocks(
  pageId: number,
  order: { id: number; position: number }[],
) {
  return prisma.$transaction(
    order.map((item) =>
      prisma.block.update({
        where: {
          id: item.id,
          pageId, 
        },
        data: { position: item.position },
      }),
    ),
  );
}
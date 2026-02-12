import { prisma } from "..";

export async function getWorkspaceData(workspaceId: number) {
  const [workspace, pages] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
        members: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    }),

    prisma.page.findMany({
      where: {
        workspaceId,
      },
      select: {
        id: true,
        title: true,
        parentPageId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    }),
  ]);

  return {
    workspace,
    pages,
  };
}

export async function getPagesByWorkspace(workspaceId: number) {
    return prisma.page.findMany({
        where: {workspaceId},
        select: {
            id: true,
            title: true,
            parentPageId: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: { createdAt: 'asc' },
    })
}

export async function getPageById(pageId: number) {
    return prisma.page.findUnique({
        where: {
            id: pageId
        },
        select: {
            id: true,
            parentPage:true,
            childPages:true,
            workspaceId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function createPage(workspaceId: number, userId: number, title?: string, parentPageId?: number | null) {
    return prisma.page.create({
        data: {
            workspaceId,
            createdBy: userId,
            title: title || "Untitled",
            parentPageId: parentPageId || null
        }, 
        select: {
            id:true,
            title: true,
            parentPageId: true,
            createdAt: true,
        }
    });
}

export async function updatePage(
    pageId: number,
    data: {
        title?: string;
        parentPageId?: number | null;
    }
) {
    return prisma.page.update({
        where: { id: pageId },
        data,
        select: {
            id: true,
            title: true,
            parentPageId: true,
            updatedAt: true,
        },
    })
}

export async function deletePage(pageId: number) {
    return prisma.$transaction( async(tx) => {
        await tx.block.deleteMany({
            where: {
                pageId
            }
        });

        await tx.page.delete({
            where: {
                id: pageId
            }
        })
    })
}
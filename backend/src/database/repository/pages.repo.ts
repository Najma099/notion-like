import { prisma } from "..";

export async function getWorkspaceData(workspaceId: number) {
    const [workspace, pages] = await Promise.all([
        prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { 
                _count: { select: { members: true } },
                owner: { select: { name: true, email: true } }, 
                members: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            }
        }),
        prisma.page.findMany({
            where: { workspaceId },
            select: {
                id: true,
                title: true,
                parentPageId: true
            },
            orderBy: { createdAt: 'asc' }
        })
    ]);

    return { workspace, pages };
}

export async function createPage(workspaceId: number, userId: number, title?: string, parentPageId?: number | null) {
    return prisma.page.create({
        data: {
            workspaceId,
            createdBy: userId,
            title: title || "Untitled",
            parentPageId: parentPageId || null
        }
    });
}
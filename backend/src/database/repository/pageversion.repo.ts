import { prisma } from "..";

async function getNextVersionNumber(pageId: number): Promise<number> {
  const latest = await prisma.pageVersion.findFirst({
    where: { pageId },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true },
  });
  return (latest?.versionNumber ?? 0) + 1;
}

export async function createPageVersion(
  pageId: number,
  blocks: object[],
  createdBy: number,
  label?: string
) {
  const versionNumber = await getNextVersionNumber(pageId);
  return prisma.pageVersion.create({
    data: { pageId, versionNumber, blocks, createdBy: String(createdBy), label },
  });
}

export async function getPageVersions(pageId: number) {
  return prisma.pageVersion.findMany({
    where: { pageId },
    orderBy: { versionNumber: "desc" },
    select: {
      id: true,
      versionNumber: true,
      createdAt: true,
      createdBy: true,
      label: true,
    },
  });
}

export async function getPageVersionById(versionId: number) {
  return prisma.pageVersion.findUnique({
    where: { id: versionId },
  });
}
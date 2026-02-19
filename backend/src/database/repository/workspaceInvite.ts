import { prisma } from '..';
import { RoleType } from "@prisma/client";

export async function createWorkspaceInvite(
  workspaceId: number,
  email: string,
  role: RoleType,
  invitedBy: number,
  token: string,
  expiresAt: Date
) {
  return prisma.workspaceInvite.create({
    data: {
      workspaceId,
      email,
      role,
      invitedBy,
      token,
      expiresAt,
    },
  });
}

export async function findInviteByToken(token: string) {
    return prisma.workspaceInvite.findUnique({
        where:{
            token
        }
    });
}

export async function isUserAlreadyMember(
  workspaceId: number,
  userId: number
): Promise<boolean> {
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  });

  return !!member;
}


export async function addUserToWorkspace(workspaceId: number, userId: number, role: RoleType) {
    return prisma.workspaceMember.create({
        data: {
            workspaceId,
            userId,
            role
        },
    });
}

export async function deleteInvite(inviteId: number) {
    return prisma.workspaceInvite.delete({
        where: {
            id:inviteId
        }
    })
}
import apiClient from "@/lib/apiClient";

export interface AcceptInviteResponse {
  workspaceId: number;
}

export async function acceptWorkspaceInvite(
  token: string
): Promise<AcceptInviteResponse> {
  return apiClient.post<AcceptInviteResponse>(
    `/workspace-invites/${token}/accept`
  );
}

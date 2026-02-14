import apiClient from "@/lib/apiClient";
import { Workspace } from "@/types/workspace.type";
import { ApiResponse } from "@/types/api.type";

export const getWorkspaces = async () => {
  const res = await apiClient.get<ApiResponse<Workspace[]>>("/workspaces");
  return res.data;
};

export const createWorkspace = async (name: string) => {
  const res = await apiClient.post<ApiResponse<Workspace>>(
    "/workspaces",
    { name }
  );
  return res.data;
};

export const updateWorkspace = async (
  workspaceId: number,
  name: string
) => {
  const res = await apiClient.patch<Workspace>(
    `/workspaces/${workspaceId}`,
    { name }
  );
  return res;
};

export const deleteWorkspace = async (workspaceId: number) => {
  await apiClient.delete(`/workspaces/${workspaceId}`);
};
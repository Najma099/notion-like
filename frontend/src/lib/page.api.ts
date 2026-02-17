import apiClient from "./apiClient";
import { Page } from "@/types/page.type";

export function fetchPageByWorkspace(workspaceId: number) {
    return apiClient.get<Page[]>(`/workspaces/${workspaceId}/pages`);
}

export function createPage(workspaceId: number, title: string) {
    return apiClient.post(`workspaces/${workspaceId}/pages`,
        {title}
    )
}

export function updatePage(
  workspaceId: number,
  pageId: number,
  data: { icon?: string; coverImage?: string; title?: string; parentPageId?: number | null }
) {
  return apiClient.patch(
    `/workspaces/${workspaceId}/pages/${pageId}`,
    data
  );
}

export function deletePage(workspaceId: number, pageId: number) {
  return apiClient.delete(
    `/workspaces/${workspaceId}/pages/${pageId}`
  );
}

export async function fetchPageById(workspaceId:number,pageId: number) {
  return apiClient.get<Page>(`/workspaces/${workspaceId}/pages/${pageId}`);
}

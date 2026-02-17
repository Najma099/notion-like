export interface Page {
  id: number;
  title: string;
  workspaceId: number;
  parentPageId?: number | null;
  createdBy?: number;
  icon?: string;      
  coverImage?: string;  
  createdAt: string;
  updatedAt: string;
}
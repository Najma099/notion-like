"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext"; 
import { Workspace } from "@/types/workspace.type";

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  isLoading: boolean;
  switchWorkspace: (workspace: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>
  setActiveWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWorkspaces = useCallback(async () => {
    const token = apiClient.getAccessToken();
    if(!token) {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await apiClient.get<Workspace[]>("/workspaces");
      setWorkspaces(data);

      if(data.length > 0) {
        const saveId = localStorage.getItem("lastWorkspaceId");
        const found = data.find((w) => w.id.toString() === saveId);
        setActiveWorkspace(found || data[0]);
      }
    } catch(err) {
      console.error("Error fetching workspaces:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (user) {
      refreshWorkspaces();
    } else {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setIsLoading(false);
    }
  }, [user, refreshWorkspaces]);

  const switchWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    localStorage.setItem("lastWorkspaceId", workspace.id.toString());
  };

  return (
    <WorkspaceContext.Provider value={{ workspaces, activeWorkspace, isLoading, switchWorkspace, refreshWorkspaces, setWorkspaces, setActiveWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return context;
};

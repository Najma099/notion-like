'use client';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspace } from '@/context/WorkspaceContext';

export default function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams();
  const router = useRouter();
  const { activeWorkspace, isLoading, refreshWorkspaces } = useWorkspace();

  useEffect(() => {
    if (workspaceId) {
      // Make sure activeWorkspace is up to date
      refreshWorkspaces();
    }
  }, [workspaceId]);

  // Wait for workspaces to load
  if (isLoading) return <div>Loading workspace...</div>;

  // Check if activeWorkspace matches the workspaceId
  if (!activeWorkspace || activeWorkspace.id.toString() !== workspaceId) {
    router.replace('/'); // redirect if user does not have access
    return null;
  }

  return <>{children}</>;
}

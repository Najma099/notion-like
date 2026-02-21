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
      refreshWorkspaces();
    }
  }, [workspaceId]);

  if (isLoading) return <div>Loading workspace...</div>;

  if (!activeWorkspace || activeWorkspace.id.toString() !== workspaceId) {
    router.replace('/'); 
    return null;
  }

  return <>{children}</>;
}

'use client';

import WorkSpaceSideBar from '@/components/workspaces/sidebar';
import PagesSidebar from '@/components/WorkspacePages/PageSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full flex flex-col">
      
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center">
        <WorkSpaceSideBar />
      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-[10%] min-w-50 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
          <PagesSidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

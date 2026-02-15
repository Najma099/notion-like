'use client';
import Protected from '@/components/protected';
import WorkSpaceSideBar from '@/components/workspaces/sidebar';

export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Protected>
            <div className="flex h-screen">
                <WorkSpaceSideBar />
                <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
                    {children}
                </main>
            </div>
        </Protected>
    );
}
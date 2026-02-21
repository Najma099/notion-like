'use client';
import Invitesend from '@/components/invite/invite-send';
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
                <div className="flex flex-col flex-1 overflow-hidden">
                    <header className="h-10 border- border-zinc-200 dark:border-zinc-800 flex items-center justify-start px-4">
                        <Invitesend />
                    </header>
                    <main className="flex-1 overflow-y-auto dark:bg-zinc-950">
                        {children}
                    </main>
                </div>
            </div>
        </Protected>
    );
}
import PagesSidebar from '../WorkspacePages/PageSidebar';
import WorkSpaceProfile from './workspace-profile';

export default function WorkSpaceSideBar() {
    return (
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen">
            <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center shrink-0">
                <WorkSpaceProfile />
            </header>

            <div className="flex-1 overflow-y-auto">
                <PagesSidebar />
            </div>
        </aside>
    );
}
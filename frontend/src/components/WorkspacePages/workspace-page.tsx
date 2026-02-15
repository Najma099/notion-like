import { useWorkspace } from '@/context/WorkspaceContext';
import Image from 'next/image';

export default function WorkspacePage() {
    const { activeWorkspace } = useWorkspace();

    return <div className="flex h-full flex-col items-center justify-center space-y-4">
        <Image
            src="/empty.svg"
            alt="empty"
            height="300"
            width="300"
            priority
            className="h-auto dark:hidden"
        />
        <Image
            src="/empty-dark.svg"
            alt="empty"
            height="300"
            width="300"
            priority
            className="hidden h-auto dark:block"
        />
        <h2 className="text-lg font-medium">
            Welcome to {activeWorkspace?.name} workspace
        </h2>
    </div>;
}

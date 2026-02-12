import { Workspace } from '@/types/workspace.type';

export default function WorkspaceList({
    workspaces,
}: {
    workspaces: Workspace[];
}) {
    return workspaces.map((workspace, idx) => {
        return <div key={idx}>
            <div>{workspace.name}</div>
        </div>;
    });
}

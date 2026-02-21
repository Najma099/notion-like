import { User } from "./auth.type";

export interface Workspace {
    _count: { members: number };
    id: number;
    name: string;
    ownerId: number;
    createdAt: string;
    updatedAt: string;
    owner: User
}

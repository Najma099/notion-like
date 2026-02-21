import { getAllWorkspacesForUser } from './database/repository/workspace.repo';

getAllWorkspacesForUser(1).then((d) => {
    console.log(d);
    console.log(d[0].members);
    
    d.forEach((f) => {
        console.log(f._count);
        console.log(f.members.length);
    });
});

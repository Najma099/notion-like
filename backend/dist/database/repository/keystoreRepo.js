"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.find = find;
exports.remove = remove;
const index_1 = require("../index");
async function create(userId, primaryKey, secondaryKey) {
    const prisma = (0, index_1.getPrismaClient)();
    return prisma.keystore.create({
        data: {
            clientId: userId,
            primaryKey,
            secondaryKey,
        },
    });
}
async function find(userId, primaryKey, secondaryKey) {
    const prisma = (0, index_1.getPrismaClient)();
    return prisma.keystore.findFirst({
        where: {
            clientId: userId,
            primaryKey,
            ...(secondaryKey && { secondaryKey }),
            status: true,
        },
    });
}
async function remove(id) {
    const prisma = (0, index_1.getPrismaClient)();
    return prisma.keystore.delete({ where: { id } });
}
//# sourceMappingURL=keystoreRepo.js.map
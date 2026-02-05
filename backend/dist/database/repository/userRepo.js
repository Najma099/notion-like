"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = findByEmail;
exports.existsByEmail = existsByEmail;
exports.findById = findById;
const index_1 = require("../index");
async function findByEmail(email) {
    const prisma = (0, index_1.getPrismaClient)();
    const user = await prisma.user.findUnique({
        where: { email },
    });
    if (!user)
        return null;
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
    };
}
async function existsByEmail(email) {
    const prisma = (0, index_1.getPrismaClient)();
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
    return !!user;
}
async function findById(id) {
    const prisma = (0, index_1.getPrismaClient)();
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
}
//# sourceMappingURL=userRepo.js.map
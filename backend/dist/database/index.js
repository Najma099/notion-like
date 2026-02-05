"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
let prisma;
async function connectDB() {
    try {
        prisma = new client_1.PrismaClient();
        await prisma.$connect();
    }
    catch (err) {
        process.exit(1);
    }
    process.on('SIGINT', async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await prisma.$disconnect();
        process.exit(0);
    });
}
function getPrismaClient() {
    if (!prisma) {
        throw new Error('Prisma client not initialized. Call connectDB() first.');
    }
    return prisma;
}
//# sourceMappingURL=index.js.map
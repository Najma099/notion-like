"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const index_1 = require("./database/index");
const config_1 = require("./config");
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
async function start() {
    try {
        await (0, index_1.connectDB)();
        console.log('Database connected');
        app_1.app.listen(config_1.port, () => {
            console.log(`Server running on port: ${config_1.port}`);
        });
    }
    catch (err) {
        console.error('Startup error:', err);
        process.exit(1);
    }
}
start().catch((err) => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
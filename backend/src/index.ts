import http from "http";
import { app } from "./app";
import { port } from "./config";
import { initWsServer } from "./websocket/wsServer";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

async function start() {
  try {
    const httpServer = http.createServer(app);
    initWsServer(httpServer);
    httpServer.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
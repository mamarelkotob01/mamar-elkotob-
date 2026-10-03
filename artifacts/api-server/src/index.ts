import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] || "3000";
const port = Number(rawPort);

console.log(`HEKAYATY: Attempting to bind to port ${port} on 0.0.0.0`);

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ HEKAYATY: Server is UP and listening on port ${port}`);
  logger.info({ port, host: "0.0.0.0" }, "Server listening and ready for Hostinger proxy");
});

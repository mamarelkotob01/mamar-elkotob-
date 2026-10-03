// Hekayaty Production Starter (CJS Bridge)
console.log("---------------------------------------");
console.log("HEKAYATY: PRODUCTION BOOT SEQUENCE");
console.log("Time:", new Date().toISOString());

const path = require('path');
const { pathToFileURL } = require('url');
const target = path.resolve(__dirname, 'dist-server/index.mjs');

console.log("Targeting Backend:", target);

// Bridge to the modern ESM engine
import(pathToFileURL(target).href)
  .then(() => {
    console.log("✨ SUCCESS: Backend System Loaded!");
  })
  .catch((err) => {
    console.error("🔥 CRITICAL BOOT ERROR:", err.message);
    console.error(err.stack);
    process.exit(1);
  });

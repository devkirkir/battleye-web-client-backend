import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import utils from "./utils/index.js";

export let db: DatabaseType | null = null;

function initDatabase() {
  if (db) return;

  let dirPath = path.dirname(fileURLToPath(import.meta.url)),
    dataDir = path.join(dirPath, "/data");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  db = new Database(path.join(dataDir, "app.db"));
}

export default { initDatabase, ...utils };

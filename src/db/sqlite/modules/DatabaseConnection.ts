import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Database, { type Database as DatabaseType } from "better-sqlite3";

import appConfig from "#config/index.js";

class DatabaseConnection {
  private db: DatabaseType | null = null;

  connect() {
    if (this.db) return;

    const dirPath = path.dirname(fileURLToPath(import.meta.url)),
      dataDir = path.join(dirPath, "/data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    this.db = new Database(path.join(dataDir, "app.db"));
    this.db.pragma("foreign_keys = true");

    if (appConfig.db.logs) console.log(`${appConfig.labels.db} Database ${appConfig.db.adapterDB} initialized`);
  }

  close() {
    if (!this.db) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    this.db.close();

    if (appConfig.db.logs) console.log(`${appConfig.labels.db} Database ${appConfig.db.adapterDB} connection closed`);
  }

  get instance() {
    return this.db;
  }
}

export default new DatabaseConnection();

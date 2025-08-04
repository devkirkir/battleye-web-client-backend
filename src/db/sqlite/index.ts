import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Database, { Database as DatabaseType } from "better-sqlite3";
import { type DatabaseAdapter } from "types/db.js";

import appConfig from "#config/index.js";

export class SqliteAdapter implements DatabaseAdapter {
  private db: DatabaseType | null = null;

  connect() {
    if (this.db) return;

    const dirPath = path.dirname(fileURLToPath(import.meta.url)),
      dataDir = path.join(dirPath, "/data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    this.db = new Database(path.join(dataDir, "app.db"));

    if (appConfig.db.logs) console.log(`[DB] Database ${appConfig.db.adapterDB} initialized`);

    this.initData();
  }

  private initData() {
    if (!this.db) throw new Error("Database not initialized");

    const isTableUserExist = this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' and name=?")
      .get("users");

    if (!isTableUserExist) {
      this.db.prepare(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);

      if (appConfig.db.logs) console.log(`[DB] Users table created!`);
    }

    const users = this.db.prepare("SELECT * FROM users").all();

    if (!users.length) {
      this.db.prepare("INSERT INTO users (username, password) VALUES (?,?)").run("admin", "12345");

      if (appConfig.db.logs) console.log(`[DB] Default user created!`);
    }
  }
}

export default SqliteAdapter;

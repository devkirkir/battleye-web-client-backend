import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import appConfig from "#config/index.js";

import { type DatabaseAdapter } from "types/db.js";

// TODO create universal methods for sql dbs

export class SqliteAdapter implements DatabaseAdapter {
  private db: DatabaseType | null = null;

  connect() {
    if (this.db) return;

    let dirPath = path.dirname(fileURLToPath(import.meta.url)),
      dataDir = path.join(dirPath, "/data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    this.db = new Database(path.join(dataDir, "app.db"));

    if (appConfig.db.logs) console.log(`[DB] Database ${appConfig.db.adapterDB} initialized`);

    this.initData();
  }

  selectOne(schema: string, arg: string): unknown {
    if (!this.db) throw new Error("Database not initialized");

    return this.db.prepare(schema).get(arg);
  }

  selectAll(schema: string): unknown {
    if (!this.db) throw new Error("Database not initialized");

    return this.db.prepare(schema).all();
  }

  insert(schema: string, ...args: string[]): unknown {
    if (!this.db) throw new Error("Database not initialized");

    return this.db.prepare(schema).run(...args);
  }

  query(schema: string): unknown {
    if (!this.db) throw new Error("Database not initialized");

    return this.db.prepare(schema).run();
  }

  private initData() {
    if (!this.db) throw new Error("Database not initialized");

    if (!this.selectOne("SELECT name FROM sqlite_master WHERE type='table' and name=?", "users")) {
      this.query(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);

      if (appConfig.db.logs) console.log(`[DB] Users table created!`);
    }

    let users = this.db.prepare("SELECT * FROM users").all();

    if (!users.length) {
      this.insert("INSERT INTO users (username, password) VALUES (?,?)", "admin", "12345");

      if (appConfig.db.logs) console.log(`[DB] User created!`);
    }
  }
}

export default SqliteAdapter;

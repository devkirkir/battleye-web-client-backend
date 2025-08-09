import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import bcrypt from "bcrypt";
import Database, { Database as DatabaseType } from "better-sqlite3";
import { LoginUserData } from "types/auth.js";
import type { DatabaseAdapter } from "types/db.js";

import appConfig from "#config/index.js";

export class SqliteAdapter implements DatabaseAdapter {
  private db: DatabaseType | null = null;

  async connect() {
    if (this.db) return;

    const dirPath = path.dirname(fileURLToPath(import.meta.url)),
      dataDir = path.join(dirPath, "/data");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    this.db = new Database(path.join(dataDir, "app.db"));

    if (appConfig.db.logs) console.log(`[DB] Database ${appConfig.db.adapterDB} initialized`);

    await this.initData();
  }

  async login({ username, password }: LoginUserData): Promise<boolean> {
    if (!this.db) throw new Error("Database not initialized");

    const dbUser = this.db.prepare("SELECT username, password FROM users WHERE username=?").get(username) as
      | LoginUserData
      | undefined;

    if (!dbUser?.username || !dbUser?.password) return false;

    const isPassEqual = await bcrypt.compare(password, dbUser.password);

    if (!isPassEqual) return false;

    return true;
  }

  private async initData() {
    if (!this.db) throw new Error("Database not initialized");

    const isTableUserExist = this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' and name=?")
      .get("users");

    if (!isTableUserExist) {
      // TODO можно вынести sql строки в отдельные константы
      // prettier-ignore
      this.db.prepare(`
          CREATE TABLE users (
            id INTEGER PRIMARY KEY,
            username VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL
          )`).run();

      if (appConfig.db.logs) console.log(`[DB] Users table created!`);
    }

    const users = this.db.prepare("SELECT * FROM users").all();

    if (!users.length) {
      const passHash = await bcrypt.hash("12345", 3);

      this.db.prepare("INSERT INTO users (username, password) VALUES (?,?)").run("admin", passHash);

      if (appConfig.db.logs) console.log(`[DB] Default user created!`);
    }
  }
}

export default new SqliteAdapter();

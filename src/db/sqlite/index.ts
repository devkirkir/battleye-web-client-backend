import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import bcrypt from "bcrypt";
import Database, { Database as DatabaseType } from "better-sqlite3";
import type { LoginSelectUserData, LoginUserData, SessionData } from "types/auth.js";
import type { DatabaseAdapter } from "types/db.js";
import { v4 as uuidv4 } from "uuid";

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
    this.db.pragma("foreign_keys = true");

    if (appConfig.db.logs) console.log(`${appConfig.labels.db} Database ${appConfig.db.adapterDB} initialized`);

    await this.initData();
  }

  // думал сделать простую авторизацию, но нужно было всё таки просто JWT использовать...
  async login({ username, password }: LoginUserData): Promise<boolean | string> {
    if (!this.db) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    const dbUser = this.db.prepare("SELECT user_id, username, password FROM users WHERE username=?").get(username) as
      | LoginSelectUserData
      | undefined;

    if (!dbUser?.username || !dbUser?.password || !dbUser?.user_id) return false;

    const isPassEqual = await bcrypt.compare(password, dbUser.password);
    if (!isPassEqual) return false;

    // пока что может быть только одна сессия
    // TODO сделать фингерпринт
    this.deleteSession(dbUser.user_id);
    const sessionId = this.generateSession(dbUser.user_id);

    return sessionId;
  }

  // простая проверка
  async checkAuth(sessionId: string) {
    // TODO сделать проверку sessionId +  фингрепринт
    if (!this.db) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    const session = this.db.prepare("SELECT * FROM sessions WHERE session_id=?").get(sessionId) as
      | SessionData
      | undefined;

    if (!session?.expires_in) return false;

    const isSessionExpired = Number(session.expires_in) > Date.now();

    return isSessionExpired;
  }

  private async initData() {
    if (!this.db) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    const isTableUserExist = this.db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' and name=?")
      .get("users");

    if (!isTableUserExist) {
      // TODO можно вынести sql строки в отдельные константы
      // prettier-ignore
      this.db.prepare(`
          CREATE TABLE users (
            user_id INTEGER PRIMARY KEY,
            username VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL
          )`).run();

      if (appConfig.db.logs) console.log(`${appConfig.labels.db} Users table created!`);

      // prettier-ignore
      this.db.prepare(`
          CREATE TABLE sessions (
            session_id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_in TIMESTAMP NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
          )`).run();

      if (appConfig.db.logs) console.log(`${appConfig.labels.db} Session table created!`);
    }

    const users = this.db.prepare("SELECT * FROM users").all();

    if (!users.length) {
      const passHash = await bcrypt.hash("12345", 3);

      this.db.prepare("INSERT INTO users (username, password) VALUES (?,?)").run("admin", passHash);

      if (appConfig.db.logs) console.log(`${appConfig.labels.db} Default user created!`);
    }
  }

  private deleteSession(userId: number) {
    if (!this.db) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    this.db.prepare("DELETE FROM sessions WHERE user_id=?").run(userId);
  }

  private generateSession(userId: number) {
    if (!this.db) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    const sessionId = uuidv4(),
      expires = Date.now() + 1000 * 60 * 60 * 2;

    this.db
      .prepare("INSERT INTO sessions(session_id, user_id, expires_in) VALUES (?,?,?)")
      .run(sessionId, userId, expires);

    return sessionId;
  }
}

export default new SqliteAdapter();

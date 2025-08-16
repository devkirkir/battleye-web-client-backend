import type { LoginUserData } from "types/auth.js";
import type { DatabaseAdapter } from "types/db.js";

import appConfig from "#config/index.js";

import AuthService from "./modules/AuthService.js";
import DatabaseConnection from "./modules/DatabaseConnection.js";
import SessionService from "./modules/SessionService.js";
import UserService from "./modules/UserService.js";
import { SQL } from "./sql.js";

export class SqliteAdapter implements DatabaseAdapter {
  private connection = DatabaseConnection;
  private users!: UserService;
  private sessions!: SessionService;
  private auth!: AuthService;

  async connect(): Promise<void> {
    this.connection.connect();

    if (!this.connection.instance) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    this.users = new UserService(this.connection.instance);
    this.sessions = new SessionService(this.connection.instance);
    this.auth = new AuthService(this.users, this.sessions);

    await this.initData();
  }

  async login(userData: LoginUserData): Promise<false | string> {
    return this.auth.login(userData);
  }

  async checkSession(sessionId: string): Promise<false | { userId: number }> {
    return this.sessions.valid(sessionId);
  }

  async close(): Promise<void> {
    this.connection.close();
  }

  private async initData() {
    if (!this.connection.instance) throw new Error(`${appConfig.labels.dbError} Database not initialized`);

    const isTableUserExist = this.connection.instance.prepare(SQL.USERS.CHECK_TABLE_EXISTS).get();

    if (!isTableUserExist) {
      this.connection.instance.prepare(SQL.USERS.CREATE_TABLE).run();
      if (appConfig.db.logs) console.log(`${appConfig.labels.db} Users table created!`);

      this.connection.instance.prepare(SQL.SESSION.CREATE_TABLE).run();
      if (appConfig.db.logs) console.log(`${appConfig.labels.db} Session table created!`);
    }

    const users = this.users.getAll();

    if (!users.length) {
      this.users.create(appConfig.user.username, appConfig.user.password);

      if (appConfig.db.logs) console.log(`${appConfig.labels.db} Default user created!`);
    }
  }
}

export default new SqliteAdapter();

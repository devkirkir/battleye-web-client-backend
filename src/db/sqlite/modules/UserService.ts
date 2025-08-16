import bcrypt from "bcrypt";
import type { Database as DatabaseType } from "better-sqlite3";
import type { LoginSelectUserData } from "types/auth.js";

import { SQL } from "../sql.js";

class UserService {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  async create(username: string, password: string) {
    const passHash = await bcrypt.hash(password, 3);

    this.db.prepare(SQL.USERS.CREATE).run(username, passHash);
  }

  getAll() {
    return this.db.prepare(SQL.USERS.GET_ALL).all();
  }

  getOne(username: string) {
    return this.db.prepare(SQL.USERS.GET_ONE).get(username) as LoginSelectUserData | undefined;
  }
}

export default UserService;

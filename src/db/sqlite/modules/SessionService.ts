import type { Database as DatabaseType } from "better-sqlite3";
import type { SessionData } from "types/auth.js";
import { v4 as uuidv4 } from "uuid";

import { SQL } from "../sql.js";

class SessionService {
  private db: DatabaseType;

  constructor(db: DatabaseType) {
    this.db = db;
  }

  create(userId: number) {
    const sessionId = uuidv4(),
      expires = Date.now() + 1000 * 60 * 60 * 2;

    this.db.prepare(SQL.SESSION.CREATE).run(sessionId, userId, expires);

    return sessionId;
  }

  delete(userId: number) {
    this.db.prepare(SQL.SESSION.DELETE).run(userId);
  }

  getOne(sessionId: string) {
    return this.db.prepare(SQL.SESSION.GET_ONE).get(sessionId) as SessionData | undefined;
  }

  valid(sessionId: string) {
    const session = this.getOne(sessionId);

    if (!session?.expires_in) return false;

    const isSessionExpired = Number(session.expires_in) > Date.now();

    return isSessionExpired ? { userId: session.user_id } : false;
  }
}

export default SessionService;

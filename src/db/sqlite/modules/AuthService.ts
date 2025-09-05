import bcrypt from "bcrypt";
import type { LoginUserData } from "types/auth.js";

import SessionService from "./SessionService.js";
import UserService from "./UserService.js";

class AuthService {
  private users: UserService;
  private session: SessionService;

  constructor(user: UserService, session: SessionService) {
    this.users = user;
    this.session = session;
  }

  async login({ username, password }: LoginUserData) {
    const dbUser = this.users.getOne(username);

    if (!dbUser?.username || !dbUser?.password || !dbUser?.user_id) return false;

    const isPassEqual = await bcrypt.compare(password, dbUser.password);
    if (!isPassEqual) return false;

    this.session.delete(dbUser.user_id);
    const sessionId = this.session.create(dbUser.user_id);

    return { sessionId, userId: dbUser.user_id };
  }
}

export default AuthService;

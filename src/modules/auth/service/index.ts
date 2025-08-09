import type { LoginUserData } from "types/auth.js";

import login from "./modules/login.js";

interface AuthService {
  login: (user: LoginUserData) => Promise<boolean | string>;
}

function authService(): AuthService {
  return { login };
}

export default authService();

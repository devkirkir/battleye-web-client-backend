import { LoginUserData } from "types/auth.js";

import login from "./modules/login.js";

interface AuthService {
  login: (user: LoginUserData) => Promise<boolean>;
}

function authService(): AuthService {
  return { login };
}

export default authService();

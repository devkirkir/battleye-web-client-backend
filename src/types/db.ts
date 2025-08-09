import type { LoginUserData } from "./auth.js";

export interface DatabaseAdapter {
  connect(): void;
  login(userData: LoginUserData): Promise<boolean | string>;
}

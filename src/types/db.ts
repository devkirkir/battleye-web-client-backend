import type { LoginUserData } from "./auth.js";

export interface DatabaseAdapter {
  connect(): Promise<void>;
  login(userData: LoginUserData): Promise<boolean | string>;
  checkAuth(sessionId: string): Promise<false | { userId: number }>;
  close(): void;
}

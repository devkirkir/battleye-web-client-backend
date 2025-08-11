export interface LoginUserData {
  username: string;
  password: string;
}

export interface LoginSelectUserData extends LoginUserData {
  user_id: number;
}

export interface SessionData {
  session_id: string;
  user_id: number;
  expires_in: string;
}

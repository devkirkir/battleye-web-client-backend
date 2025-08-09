export interface LoginUserData {
  username: string;
  password: string;
}

export interface LoginSelectUserData extends LoginUserData {
  user_id: number;
}

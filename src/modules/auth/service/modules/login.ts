import { LoginUserData } from "types/auth.js";

import DBAdapter from "#db";

const login = async (userData: LoginUserData) => {
  return await DBAdapter.login(userData);
};

export default login;

export const SQL = {
  USERS: {
    CREATE_TABLE: `
          CREATE TABLE users (
            user_id INTEGER PRIMARY KEY,
            username VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL
          )`,
    CHECK_TABLE_EXISTS: `SELECT name FROM sqlite_master WHERE type='table' and name='users'`,
    CREATE: `INSERT INTO users (username, password) VALUES (?,?)`,
    GET_ALL: `SELECT * FROM users`,
    GET_ONE: `SELECT user_id, username, password FROM users WHERE username=?`,
  },
  SESSION: {
    CREATE_TABLE: `
          CREATE TABLE sessions (
            session_id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_in TIMESTAMP NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE
          )`,
    CREATE: `INSERT INTO sessions(session_id, user_id, expires_in) VALUES (?,?,?)`,
    DELETE: `DELETE FROM sessions WHERE user_id=?`,
    GET_ONE: `SELECT * FROM sessions WHERE session_id=?`,
  },
};

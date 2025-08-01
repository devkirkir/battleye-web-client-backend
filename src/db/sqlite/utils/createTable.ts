import getDatabase from "./getDatabase.js";

//TODO Types, name, columns

const createTable = getDatabase((name, columns, db) => {
  const statement = db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);

  statement.run();
});

export default createTable;

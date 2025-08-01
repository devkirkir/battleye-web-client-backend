import { db } from "../index.js";

//TODO Types

function getDatabase(cb) {
  return (...args) => {
    try {
      if (!db) throw new Error("Database not init");

      return cb(...args, db);
    } catch (err) {
      console.error(err);
    }
  };
}

export default getDatabase;

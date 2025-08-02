import appConfig from "#config/index.js";
import sqlite from "./sqlite/index.js";

const adapters = {
  sqlite,
};

const DBAdapter = adapters[appConfig.db.adapterDB];

if (!DBAdapter) {
  throw new Error(`Unsupported DB adapter: ${appConfig.db.adapterDB}`);
}

export default DBAdapter;

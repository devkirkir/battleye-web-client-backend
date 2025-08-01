import appConfig from "#config/index.js";
import sqlite from "./sqlite/index.js";

const adapters = {
  sqlite,
};

export default adapters[appConfig.db.adapterDB];

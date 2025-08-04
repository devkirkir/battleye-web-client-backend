import type { RequestSchemaType } from "../controller/routes/connect.js";
import type { ConnectPromise } from "./modules/connect.js";
import { connect } from "./modules/index.js";

interface RconService {
  connect: (config: RequestSchemaType) => Promise<ConnectPromise>;
}

function rconService(): RconService {
  return { connect };
}

export default rconService;

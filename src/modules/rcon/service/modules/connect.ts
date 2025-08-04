import RCON from "battleye-node";

import type { RequestSchemaType } from "../../controller/routes/connect.js";

interface ConnectPromiseSuccess {
  isConnected: true;
  rcon: RCON;
}

interface ConnectPromiseRejected {
  isConnected: false;
  errorMsg?: string;
}

export type ConnectPromise = ConnectPromiseSuccess | ConnectPromiseRejected;

const connect = async (config: RequestSchemaType) => {
  const { address, password, port } = config;

  // TODO сделать таймаут

  const rcon = new RCON({
    address,
    port: Number(port),
    password,
  });

  rcon.login();

  const promise = new Promise<ConnectPromise>((resolve, reject) => {
    rcon.on("onConnect", (isConnected: boolean) => {
      if (isConnected) {
        resolve({ isConnected, rcon });
      }
    });

    rcon.on("error", (errorMsg) => {
      rcon.logout();

      reject({ isConnected: false, errorMsg });
    });
  });

  return promise;
};

export default connect;

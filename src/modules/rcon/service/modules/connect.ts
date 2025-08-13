import RCON from "battleye-node";

import appConfig from "#config/index.js";

import type { RequestSchemaType } from "../../controller/routes/connect.js";

interface ConnectPromiseSuccess {
  isConnected: true;
  rcon: RCON;
}

interface ConnectPromiseRejected {
  isConnected: false;
  msg?: string;
}

export type ConnectPromise = ConnectPromiseSuccess | ConnectPromiseRejected;

const connect = async (config: RequestSchemaType) => {
  const { address, password, port } = config;

  const rcon = new RCON({
    address,
    port: Number(port),
    password,
    connectionTimeout: appConfig.rcon.timeout,
  });

  rcon.login();

  const promise = new Promise<ConnectPromise>((resolve, reject) => {
    const removeListeners = () => {
      clearTimeout(timeoutId);

      rcon.off("onConnect", onConnect);
      rcon.off("error", onError);
    };

    const onConnect = (isConnected: boolean) => {
      if (isConnected) {
        removeListeners();

        resolve({ isConnected, rcon });
      }
    };

    const onError = (errorMsg: string) => {
      rcon.logout();
      removeListeners();

      reject({ isConnected: false, msg: errorMsg });
    };

    const timeoutId = setTimeout(() => {
      rcon.logout();
      removeListeners();

      reject({ isConnected: false, msg: "Connection timeout" });
    }, 5000);

    rcon.on("onConnect", onConnect);
    rcon.on("error", onError);
  });

  return promise;
};

export default connect;

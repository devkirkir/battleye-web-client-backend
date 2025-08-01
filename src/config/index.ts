import "dotenv/config";

interface AppConfig {
  app: {
    port: number;
  };
  db: {
    adapterDB: "sqlite";
  };
}

const appConfig: AppConfig = {
  app: {
    port: Number(process.env.APP_PORT),
  },
  db: {
    adapterDB: "sqlite",
  },
};

export default appConfig;

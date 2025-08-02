import "dotenv/config";

type SupportedAdapters = "sqlite";

interface AppConfig {
  app: {
    port: number;
  };
  db: {
    adapterDB: SupportedAdapters;
    logs?: boolean;
  };
}

const appConfig: AppConfig = {
  app: {
    port: Number(process.env.APP_PORT) || 5000,
  },
  db: {
    // пойдет)))
    adapterDB: (process.env.DB_ADAPTER || "sqlite") as SupportedAdapters,
    logs: !!process.env.DB_LOGS || true,
  },
};

export default appConfig;

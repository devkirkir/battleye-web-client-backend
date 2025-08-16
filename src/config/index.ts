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
  rcon: {
    timeout: number;
  };
  labels: {
    db: string;
    dbError: string;
  };
  user: {
    username: string;
    password: string;
  };
}

const appConfig: AppConfig = {
  app: {
    port: Number(process.env.APP_PORT) || 5000,
  },
  db: {
    adapterDB: (process.env.DB_ADAPTER || "sqlite") as SupportedAdapters,
    logs: !!process.env.DB_LOGS || true,
  },
  rcon: {
    timeout: 50000,
  },
  labels: {
    db: "[DB]",
    dbError: "[DB ERROR]",
  },
  user: {
    username: process.env.DEFAULT_USERNAME || "admin",
    password: process.env.DEFAULT_PASSWORD || "",
  },
};

export default appConfig;

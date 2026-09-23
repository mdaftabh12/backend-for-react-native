import dotenv from "dotenv";
dotenv.config();

const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  corsOrigin: process.env.CORS_ORIGIN || "*",

  database: {
    mongoUri: process.env.MONGO_URI || "",
  },

  jwt: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "",
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",

    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  },
} as const;

// Required environment variables
if (!env.database.mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

if (!env.jwt.accessTokenSecret) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

if (!env.jwt.refreshTokenSecret) {
  throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

export default env;

import jwt from "jsonwebtoken";
import env from "../config/env";

const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
    },
    env.jwt.accessTokenSecret,
    {
      expiresIn: env.jwt.accessTokenExpiresIn as jwt.SignOptions["expiresIn"],
    },
  );
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    {
      userId,
    },
    env.jwt.refreshTokenSecret,
    {
      expiresIn: env.jwt.refreshTokenExpiresIn as jwt.SignOptions["expiresIn"],
    },
  );
};

export { generateAccessToken, generateRefreshToken };

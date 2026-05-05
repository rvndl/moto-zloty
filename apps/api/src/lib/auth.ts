import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { ErrorResponse } from "../models/common";

export interface JwtPayload {
  id: string;
  username: string;
  rank: string;
}

class AuthError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function isPermitted(rank: string) {
  return rank === "admin" || rank === "mod";
}

export const jwtPlugin = new Elysia({ name: "plugin.jwt" }).use(
  jwt({
    name: "jwt",
    secret: Bun.env.JWT_SECRET || "development-secret-change-me",
    exp: "7d",
  }),
);

export const authMiddleware = new Elysia({ name: "middleware.auth" })
  .use(jwtPlugin)
  .model({ "common.error": ErrorResponse })
  .onError(({ error, set }) => {
    if (error instanceof AuthError) {
      set.status = error.statusCode;

      return { error: error.message };
    }
  })
  .derive({ as: "scoped" }, async ({ headers, jwt }) => {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AuthError(401, "Brak uprawnień");
    }

    const token = authHeader.slice(7);

    const payload = (await jwt.verify(token)) as JwtPayload | false;
    if (!payload) {
      throw new AuthError(401, "Nieprawidłowy token");
    }

    return { user: payload };
  });

export const modMiddleware = new Elysia({ name: "middleware.mod" })
  .use(jwtPlugin)
  .model({ "common.error": ErrorResponse })
  .onError(({ error, set }) => {
    if (error instanceof AuthError) {
      set.status = error.statusCode;

      return { error: error.message };
    }
  })
  .derive({ as: "scoped" }, async ({ headers, jwt }) => {
    const authHeader = headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AuthError(401, "Brak uprawnień");
    }

    const token = authHeader.slice(7);

    const payload = (await jwt.verify(token)) as JwtPayload | false;
    if (!payload) {
      throw new AuthError(401, "Nieprawidłowy token");
    }

    if (!isPermitted(payload.rank)) {
      throw new AuthError(403, "Brak uprawnień");
    }

    return { user: payload };
  });

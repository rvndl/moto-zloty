import { Elysia } from "elysia";
import { jwtPlugin } from "../lib/auth";
import { AuthService } from "../services/auth";
import {
  RegisterBody,
  LoginBody,
  AuthResponse,
  AuthError,
} from "../models/auth";

export const authRoutes = new Elysia({ name: "routes.auth" })
  .use(jwtPlugin)
  .model({
    "auth.register": RegisterBody,
    "auth.login": LoginBody,
    "auth.response": AuthResponse,
    "auth.error": AuthError,
  })
  .put(
    "/register",
    async ({ body, jwt, status }) => {
      const result = await AuthService.register(body);

      if (!result.success) {
        return status(result.statusCode as 400 | 500, { error: result.error });
      }

      const token = await jwt.sign({
        id: result.data.id,
        username: result.data.username,
        rank: result.data.rank,
      });

      return {
        id: result.data.id,
        username: result.data.username,
        rank: result.data.rank,
        token,
      };
    },
    {
      body: "auth.register",
      response: {
        200: "auth.response",
        400: "auth.error",
        500: "auth.error",
      },
      detail: {
        summary: "Register a new account",
        tags: ["Auth"],
      },
    },
  )
  .post(
    "/login",
    async ({ body, jwt, status }) => {
      const result = await AuthService.login(body);

      if (!result.success) {
        return status(result.statusCode as 400 | 500, { error: result.error });
      }

      const token = await jwt.sign({
        id: result.data.id,
        username: result.data.username,
        rank: result.data.rank,
      });

      return {
        id: result.data.id,
        username: result.data.username,
        rank: result.data.rank,
        token,
      };
    },
    {
      body: "auth.login",
      response: {
        200: "auth.response",
        400: "auth.error",
        500: "auth.error",
      },
      detail: {
        summary: "Login to an existing account",
        tags: ["Auth"],
      },
    },
  );

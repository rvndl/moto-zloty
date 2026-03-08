import { t } from "elysia";
import { accountRankEnum } from "../db/schema";

const rankValues = accountRankEnum.enumValues;
const RankType = t.Union([
  t.Literal(rankValues[0]),
  t.Literal(rankValues[1]),
  t.Literal(rankValues[2]),
]);

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 32;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

export const RegisterBody = t.Object({
  username: t.String({
    minLength: USERNAME_MIN,
    maxLength: USERNAME_MAX,
    description: "Username for the new account",
  }),
  password: t.String({
    minLength: PASSWORD_MIN,
    maxLength: PASSWORD_MAX,
    description: "Password for the new account",
  }),
  email: t.String({ format: "email", description: "Email address" }),
  recaptcha: t.String({ description: "Turnstile captcha token" }),
});

export const LoginBody = t.Object({
  username: t.String({
    minLength: USERNAME_MIN,
    maxLength: USERNAME_MAX,
    description: "Account username",
  }),
  password: t.String({
    minLength: PASSWORD_MIN,
    maxLength: PASSWORD_MAX,
    description: "Account password",
  }),
  recaptcha: t.String({ description: "Turnstile captcha token" }),
});

export const AuthResponse = t.Object({
  id: t.String({ format: "uuid" }),
  username: t.String(),
  rank: RankType,
  token: t.String(),
});

export const AuthError = t.Object({
  error: t.String(),
});

export type RegisterBodyType = typeof RegisterBody.static;
export type LoginBodyType = typeof LoginBody.static;
export type AuthResponseType = typeof AuthResponse.static;

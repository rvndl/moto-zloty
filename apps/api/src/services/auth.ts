import { hash, verify } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { account, accountRankEnum } from "../db/schema";
import { verifyTurnstile } from "../lib/turnstile";
import type { RegisterBodyType, LoginBodyType } from "../models/auth";
import { type ServiceResult, ok, err } from "./types";

export type AccountRank = (typeof accountRankEnum.enumValues)[number];

export interface AuthResult {
  id: string;
  username: string;
  rank: AccountRank;
}

export abstract class AuthService {
  static async register(
    data: RegisterBodyType,
  ): Promise<ServiceResult<AuthResult>> {
    const { username, password, email, recaptcha } = data;

    if (!(await verifyTurnstile(recaptcha))) {
      return err(400, "Weryfikacja Turnstile nie powiodła się");
    }

    const existingUsername = await db
      .select()
      .from(account)
      .where(eq(account.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return err(400, "Konto z taką nazwą użytkownika już istnieje");
    }

    const existingEmail = await db
      .select()
      .from(account)
      .where(eq(account.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return err(400, "Konto z takim adresem e-mail już istnieje");
    }

    const hashedPassword = await hash(password);
    const [newAccount] = await db
      .insert(account)
      .values({
        username,
        password: hashedPassword,
        email,
      })
      .returning();

    if (!newAccount) {
      return err(500, "Nie udało się utworzyć konta");
    }

    return ok({
      id: newAccount.id,
      username: newAccount.username,
      rank: newAccount.rank || "user",
    });
  }

  static async login(data: LoginBodyType): Promise<ServiceResult<AuthResult>> {
    const { username, password, recaptcha } = data;

    if (!(await verifyTurnstile(recaptcha))) {
      return err(400, "Weryfikacja Turnstile nie powiodła się");
    }

    const [foundAccount] = await db
      .select()
      .from(account)
      .where(eq(account.username, username))
      .limit(1);

    if (!foundAccount) {
      return err(400, "Podano błędny login lub hasło");
    }

    const validPassword = await verify(foundAccount.password, password);
    if (!validPassword) {
      return err(400, "Podano błędny login lub hasło");
    }

    return ok({
      id: foundAccount.id,
      username: foundAccount.username,
      rank: foundAccount.rank || "user",
    });
  }
}

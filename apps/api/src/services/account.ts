import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { account, event } from "../db/schema";
import { type ServiceResult, ok, err } from "./types";
import { verify, hash } from "@node-rs/argon2";

export interface AccountWithEvents {
  account: typeof account.$inferSelect;
  events: (typeof event.$inferSelect)[];
}

export abstract class AccountService {
  static async getById(
    accountId: string,
  ): Promise<ServiceResult<typeof account.$inferSelect>> {
    const [acc] = await db
      .select()
      .from(account)
      .where(eq(account.id, accountId))
      .limit(1);

    if (!acc) {
      return err(404, "Użytkownik nie został odnaleziony");
    }

    return ok(acc);
  }

  static async getDetails(
    accountId: string,
  ): Promise<ServiceResult<AccountWithEvents>> {
    const [acc] = await db
      .select()
      .from(account)
      .where(eq(account.id, accountId))
      .limit(1);

    if (!acc) {
      return err(404, "Użytkownik nie został odnaleziony");
    }

    const events = await db
      .select()
      .from(event)
      .where(eq(event.accountId, accountId))
      .orderBy(desc(event.createdAt));

    return ok({ account: acc, events });
  }

  static async validatePassword(
    accountId: string,
    password: string,
  ): Promise<ServiceResult<typeof account.$inferSelect>> {
    const [acc] = await db
      .select()
      .from(account)
      .where(eq(account.id, accountId))
      .limit(1);

    if (!acc) {
      return err(404, "Użytkownik nie został odnaleziony");
    }

    if (!acc.password) {
      return err(400, "Konto nie ma ustawionego hasła");
    }

    const isPasswordValid = await verify(acc.password, password);
    if (!isPasswordValid) {
      return err(400, "Niepoprawne hasło");
    }

    return ok(acc);
  }

  static async changePassword(
    accountId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<ServiceResult<{ success: boolean }>> {
    const validationResult = await this.validatePassword(
      accountId,
      currentPassword,
    );
    if (!validationResult.success) {
      return validationResult as ServiceResult<{ success: boolean }>;
    }

    const hashedPassword = await hash(newPassword);

    await db
      .update(account)
      .set({ password: hashedPassword })
      .where(eq(account.id, accountId));

    return ok({ success: true });
  }

  static async getByUsername(
    username: string,
  ): Promise<ServiceResult<typeof account.$inferSelect>> {
    const [acc] = await db
      .select()
      .from(account)
      .where(eq(account.username, username))
      .limit(1);

    if (!acc) {
      return err(404, "Użytkownik nie został odnaleziony");
    }

    return ok(acc);
  }

  static async getByEmail(
    email: string,
  ): Promise<ServiceResult<typeof account.$inferSelect>> {
    const [acc] = await db
      .select()
      .from(account)
      .where(eq(account.email, email))
      .limit(1);

    if (!acc) {
      return err(404, "Użytkownik nie został odnaleziony");
    }

    return ok(acc);
  }

  static async listAll() {
    return await db
      .select({
        id: account.id,
        username: account.username,
        email: account.email,
        rank: account.rank,
        banned: account.banned,
        banReason: account.banReason,
        bannedAt: account.bannedAt,
        createdAt: account.createdAt,
      })
      .from(account);
  }
}

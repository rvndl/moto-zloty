import { Event } from "./event";

export type AccountRank = "USER" | "MOD" | "ADMIN";

interface Account {
  id: string;
  username: string;
  password: string;
  email: string;
  rank: AccountRank;
  banned: boolean;
  ban_reason?: string;
  banned_at?: string;
  created_at: string;
  events?: Event[];
}

export type PublicAccount = Omit<
  Account,
  "banned" | "ban_reason" | "banned_at" | "password" | "email"
>;

export type AccountWithoutPassword = Omit<Account, "password">;

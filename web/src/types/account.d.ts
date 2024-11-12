import { Event } from "./event";

export type AccountRank = "USER" | "ADMIN";

export interface PublicAccount {
  id: string;
  username: string;
  created_at: string;
  rank: AccountRank;
  events: Event[];
}

export type AccountRank = "USER" | "ADMIN";

export interface PublicAccount {
  id: number;
  username: string;
  created_at: string;
  rank: AccountRank;
  // events: Event[];
}

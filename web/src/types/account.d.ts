export type AccountRank = "USER" | "ADMIN";

export interface PublicAccount {
  id: string;
  username: string;
  created_at: string;
  rank: AccountRank;
  // TODO: add event type
  events: any[];
}

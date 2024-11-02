import { AccountRank } from "@types/account";

interface LoginResponse {
  username: string;
  rank: AccountRank;
  token: string;
}

export type { LoginResponse };

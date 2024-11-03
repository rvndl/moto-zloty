import { AccountRank } from "types/account";

interface LoginResponse {
  id: number;
  username: string;
  rank: AccountRank;
  token: string;
}

export type { LoginResponse };

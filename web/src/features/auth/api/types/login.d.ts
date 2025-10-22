import { AccountRank } from "types/account";

interface LoginResponse {
  id: string;
  username: string;
  rank: AccountRank;
  token: string;
}

export type { LoginResponse };

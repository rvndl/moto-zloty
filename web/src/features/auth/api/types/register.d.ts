import { AccountRank } from "@types/account";

interface RegisterResponse {
  username: string;
  rank: AccountRank;
  token: string;
}

export type { RegisterResponse };

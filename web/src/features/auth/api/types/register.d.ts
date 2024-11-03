import { AccountRank } from "types/account";

interface RegisterResponse {
  id: number;
  username: string;
  rank: AccountRank;
  token: string;
}

export type { RegisterResponse };

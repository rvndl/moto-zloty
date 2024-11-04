import { AccountRank } from "types/account";

interface RegisterResponse {
  id: string;
  username: string;
  rank: AccountRank;
  token: string;
}

export type { RegisterResponse };

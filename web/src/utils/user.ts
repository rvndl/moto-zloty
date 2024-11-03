import { AccountRank } from "types/account";
import { match } from "ts-pattern";

export const rankToString = (rank?: AccountRank) => {
  return match(rank)
    .with("USER", () => "Użytkownik")
    .with("ADMIN", () => "Administrator")
    .otherwise(() => "Nieznana ranga");
};

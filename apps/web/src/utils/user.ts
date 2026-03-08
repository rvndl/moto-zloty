import { type AccountRank } from "@features/account/types/account";
import { match } from "ts-pattern";

export const rankToString = (rank?: AccountRank) => {
  return match(rank)
    .with("user", () => "Użytkownik")
    .with("mod", () => "Moderator")
    .with("admin", () => "Administrator")
    .otherwise(() => "Nieznana ranga");
};

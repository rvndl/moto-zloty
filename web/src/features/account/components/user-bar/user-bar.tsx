import { Card } from "@components";
import { rankToString } from "@utils/user";
import { DataItem } from "./data-item";
import { getValue } from "@utils/index";
import { PublicAccount } from "types/account";
import { UserIcon } from "lucide-react";

interface Props {
  account?: PublicAccount;
}

const UserBar = ({ account }: Props) => {
  return (
    <Card>
      <div className="flex gap-2">
        <div className="flex items-center justify-center rounded-full w-14 h-14 bg-accent">
          <UserIcon />
        </div>
        <div className="leading-tight">
          <h2 className="text-lg font-semibold">{account?.username}</h2>
          <p className="text-sm text-muted">{rankToString(account?.rank)}</p>
        </div>
      </div>
      <div className="flex gap-6 mt-4">
        <DataItem
          label="Rejestracja"
          value={getValue(account?.created_at, "datetime")}
        />
        <div className="w-0.5 bg-accent">&nbsp;</div>
        <DataItem
          label="Wydarzenia"
          value={getValue(account?.events?.length, "number", "Brak")}
        />
      </div>
    </Card>
  );
};

export { UserBar };

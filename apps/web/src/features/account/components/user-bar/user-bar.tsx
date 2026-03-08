import { rankToString } from "@utils/user";
import { DataItem } from "./data-item";
import { getValue } from "@utils/index";
import { UserIcon } from "lucide-react";
import { Card } from "@components/card";
import { Account } from "@features/account/types/account";

interface Props {
  account?: Account;
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
          value={getValue(account?.createdAt ?? "", "datetime")}
        />
        <div className="w-0.5 bg-accent">&nbsp;</div>
        <DataItem
          label="Wydarzenia"
          value={getValue(account?.events?.length ?? 0, "number", "Brak")}
        />
      </div>
    </Card>
  );
};

export { UserBar };

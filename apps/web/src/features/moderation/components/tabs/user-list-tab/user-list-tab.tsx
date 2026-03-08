import { Card } from "@components/card";
import { Table } from "@components/table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { UserDetailsCell } from "./user-details-cell";
import { rankToString } from "@utils/user";
import { api, useQuery } from "api/eden";
import { ModerationAccount } from "@features/moderation/types/moderation-account";
import { getValue } from "@utils/index";

const ACCOUNTS_QUERY_KEY = ["ACCOUNTS"];

const UserListTab = () => {
  const { data: accounts } = useQuery(ACCOUNTS_QUERY_KEY, api.mod.accounts.get);

  const columns = useMemo<ColumnDef<ModerationAccount>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Nazwa użytkownika",
        cell: (info) => <UserDetailsCell account={info.row.original} />,
        meta: { bolded: true },
      },
      {
        accessorKey: "rank",
        header: "Ranga",
        cell: (info) =>
          rankToString(info.getValue() as ModerationAccount["rank"]),
      },
      {
        accessorKey: "createdAt",
        header: "Rejestracja",
        cell: (info) => getValue(info.getValue() as string, "datetime"),
        meta: { rightAligned: true },
      },
    ],
    [],
  );

  return (
    <Card
      title="Lista użytkowników"
      description="Lista wszystkich zarejestrowanych użytkowników"
    >
      <Table columns={columns} data={accounts} />
    </Card>
  );
};

export { UserListTab, ACCOUNTS_QUERY_KEY };

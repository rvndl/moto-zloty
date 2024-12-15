import { Card } from "@components/card";
import { Table } from "@components/table";
import { useAccountListQuery } from "@features/moderation/api";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import { AccountRank, AccountWithoutPassword } from "types/account";
import { UserDetailsCell } from "./user-details-cell";
import { rankToString } from "@utils/user";

const UserListTab = () => {
  const { data: accounts } = useAccountListQuery();

  const columns = useMemo<ColumnDef<AccountWithoutPassword>[]>(
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
        cell: (info) => rankToString(info.getValue() as AccountRank),
      },
      {
        accessorKey: "created_at",
        header: "Rejestracja",
        cell: (info) => format(info.getValue() as string, "dd.MM.yyyy HH:mm"),
        meta: { rightAligned: true },
      },
    ],
    []
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

export { UserListTab };

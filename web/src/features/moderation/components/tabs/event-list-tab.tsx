import { Card, Table } from "@components";
import { EventStatusBadge } from "@features/event/components";
import { useEventListQuery } from "@features/moderation/api";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { Event, EventStatus } from "types/event";

const EventListTab = () => {
  const { data: events } = useEventListQuery();

  const columns = useMemo<ColumnDef<Event>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nazwa",
        cell: (info) => (
          <Link href={`/wydarzenie/${info.row.original.id}`}>
            {info.getValue() as string}
          </Link>
        ),
        meta: { bolded: true },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => (
          <EventStatusBadge status={info.getValue() as EventStatus} />
        ),
      },
      {
        accessorKey: "created_at",
        header: "Data utworzenia",
        cell: (info) => format(info.getValue() as string, "dd.MM.yyyy HH:mm"),
      },
    ],
    []
  );

  return (
    <Card
      title="Lista wydarzeń"
      description="Lista wydarzeń, które oczekują na akceptację"
    >
      <Table
        columns={columns}
        data={events}
        initialState={{ sorting: [{ id: "status", desc: true }] }}
      />
    </Card>
  );
};

export { EventListTab };

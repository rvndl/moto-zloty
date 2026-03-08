import { Card } from "@components/card";
import { Table } from "@components/table";
import { EventStatusBadge } from "@features/event/components";
import { ModerationEvent } from "@features/moderation/types/moderation-event";
import { ColumnDef } from "@tanstack/react-table";
import { getValue } from "@utils/index";
import { api, useQuery } from "api/eden";
import Link from "next/link";
import { useMemo } from "react";

const MODERATION_EVENTS_QUERY_KEY = ["MODERATION_EVENTS"];

const EventListTab = () => {
  const { data: events } = useQuery(
    MODERATION_EVENTS_QUERY_KEY,
    api.mod.events.get,
  );

  const columns = useMemo<ColumnDef<ModerationEvent>[]>(
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
          <EventStatusBadge
            status={info.getValue() as ModerationEvent["status"]}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Data utworzenia",
        cell: (info) => getValue(info.getValue() as string, "datetime"),
      },
    ],
    [],
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

export { EventListTab, MODERATION_EVENTS_QUERY_KEY };

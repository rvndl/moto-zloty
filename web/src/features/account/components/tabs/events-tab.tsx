import { Card } from "@components/card";
import { AccountResponse } from "@features/account/api/types/account";
import { EventCard } from "@features/event";
import { sortEvents } from "@utils/event";
import { useMemo } from "react";

interface Props {
  account?: AccountResponse;
}

const EventsTab = ({ account }: Props) => {
  const sortedEvents = useMemo(
    () => sortEvents(account?.events),
    [account?.events],
  );

  const isEmpty = !account?.events?.length;

  return (
    <Card
      title={`Wydarzenia (${account?.events?.length ?? 0})`}
      description="Lista wydarzeń dodanych przez użytkownika"
    >
      <div className="flex flex-wrap gap-2 mt-4">
        {isEmpty ? (
          <p className="text-muted">Brak wydarzeń</p>
        ) : (
          sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} size="small" />
          ))
        )}
      </div>
    </Card>
  );
};

export { EventsTab };

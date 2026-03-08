import { Card } from "@components/card";
import { Account, AccountEvent } from "@features/account/types/account";
import { EventCard } from "@features/event";
import { useMemo } from "react";
import { isAfter, compareAsc } from "date-fns";
import { Event } from "@features/event/types";

interface Props {
  account?: Account;
}

const sortAccountEvents = (events?: AccountEvent[]) => {
  if (!events) {
    return [];
  }

  const today = new Date();

  return events.sort((a, b) => {
    const aHasEnded = isAfter(today, new Date(a.dateTo));
    const bHasEnded = isAfter(today, new Date(b.dateTo));

    if (aHasEnded && !bHasEnded) {
      return 1;
    }

    if (!aHasEnded && bHasEnded) {
      return -1;
    }

    return compareAsc(new Date(a.dateFrom), new Date(b.dateFrom));
  });
};

const EventsTab = ({ account }: Props) => {
  const sortedEvents = useMemo(
    () => sortAccountEvents(account?.events),
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
            <EventCard key={event.id} event={event as Event} />
          ))
        )}
      </div>
    </Card>
  );
};

export { EventsTab };

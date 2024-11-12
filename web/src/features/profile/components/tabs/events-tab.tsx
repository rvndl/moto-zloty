import { Card } from "@components/card";
import { Event } from "@features/event";
import { ProfileResponse } from "@features/profile/api/types/profile";
import { sortEvents } from "@utils/event";
import { useMemo } from "react";

interface Props {
  account?: ProfileResponse;
}

const EventsTab = ({ account }: Props) => {
  const sortedEvents = useMemo(
    () => sortEvents(account?.events),
    [account?.events]
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
          sortedEvents?.map((event) => (
            <Event key={event.id} event={event} size="small" />
          ))
        )}
      </div>
    </Card>
  );
};

export { EventsTab };

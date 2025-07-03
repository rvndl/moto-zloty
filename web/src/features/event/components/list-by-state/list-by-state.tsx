import { states } from "@features/event/utils";
import { StateList } from "./state-list";
import { ListItem } from "./list-item";
import { useEventListByStateQuery } from "@features/event/api";
import { useMemo } from "react";
import { Event } from "types/event";

const ListByState = () => {
  const { data: events } = useEventListByStateQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const groupedEvents = useMemo(() => {
    const now = new Date();

    const sortedEvents = [...(events || [])].sort((a, b) => {
      const aFrom = new Date(a.date_from);
      const aTo = new Date(a.date_to);
      const bFrom = new Date(b.date_from);
      const bTo = new Date(b.date_to);

      const aOngoing = aFrom <= now && now <= aTo;
      const bOngoing = bFrom <= now && now <= bTo;

      if (aOngoing && !bOngoing) return -1;
      if (!aOngoing && bOngoing) return 1;

      if (!aOngoing && !bOngoing) {
        const aUpcoming = aFrom > now;
        const bUpcoming = bFrom > now;

        if (aUpcoming && !bUpcoming) return -1;
        if (!aUpcoming && bUpcoming) return 1;

        if (aUpcoming && bUpcoming) {
          return aFrom.getTime() - bFrom.getTime();
        } else {
          return bFrom.getTime() - aFrom.getTime();
        }
      }

      return aFrom.getTime() - bFrom.getTime();
    });

    const grouped = sortedEvents.reduce(
      (groups, event) => {
        const state = event.full_address?.state?.toLowerCase() || "unknown";
        if (!groups[state]) {
          groups[state] = [];
        }

        if (groups[state].length < 4) {
          groups[state].push(event);
        }

        return groups;
      },
      {} as Record<string, Event[]>,
    );

    return grouped;
  }, [events]);

  return (
    <section className="w-full p-16 bg-black text-white mt-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
        {states.map((state) => (
          <StateList key={state} state={state}>
            {groupedEvents?.[state]?.map((event) => (
              <ListItem key={event.id} event={event} />
            ))}
          </StateList>
        ))}
      </div>
    </section>
  );
};

export default ListByState;

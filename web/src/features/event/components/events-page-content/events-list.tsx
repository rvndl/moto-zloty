import { type Event as EventType } from "types/event";
import { Event } from "../event";
import { useMemo } from "react";
import { Skeleton } from "@components";
import { sortEvents } from "@utils/event";
import { motion } from "framer-motion";

interface Props {
  events?: EventType[];
}

const EventsList = ({ events }: Props) => {
  const sortedEvents = useMemo(() => sortEvents(events), [events]);

  if (!events) {
    return (
      <section className="flex gap-4 pb-4 overflow-hidden gap-x-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-60 shrink-0" />
        ))}
      </section>
    );
  }

  return (
    <section className="flex pt-1 pb-2 overflow-x-auto gap-x-1 md:gap-x-2 snap-x">
      {sortedEvents?.map((event, idx) => (
        <motion.span
          key={event.id}
          className="flex-shrink-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: idx * 0.05 },
          }}
        >
          <Event key={event.id} event={event} />
        </motion.span>
      ))}
    </section>
  );
};

export { EventsList };

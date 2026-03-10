import { type CarouselEvent } from "@features/event/types";
import { EventCard } from "../../shared/event-card";
import { useCallback, useMemo, useRef, useState } from "react";
import { Skeleton } from "@components/skeleton";
import { sortEvents } from "@utils/event";
import { motion } from "framer-motion";

interface Props {
  events?: CarouselEvent[];
}

const EventsCarousel = ({ events }: Props) => {
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const scrollRef = useRef<HTMLElement>(null);

  const sortedEvents = useMemo(() => sortEvents(events), [events]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    setShowLeftFade(el.scrollLeft > 0);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  if (!events) {
    return (
      <section className="flex gap-4 pb-4 overflow-hidden gap-x-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-72 h-32 shrink-0" />
        ))}
      </section>
    );
  }

  return (
    <div className="relative">
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none rounded-l-lg" />
      )}

      <section
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex pt-1 pb-1 overflow-x-auto overflow-y-hidden gap-x-1 md:gap-x-2 snap-x scrollbar-thin"
      >
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
            <EventCard event={event} />
          </motion.span>
        ))}
      </section>

      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none rounded-r-lg" />
      )}
    </div>
  );
};

export { EventsCarousel };

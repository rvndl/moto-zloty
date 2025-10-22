import { Map } from "@components/map";
import { useIsMobile } from "@hooks/use-is-mobile";
import { EventMarker } from "./event-marker";
import { getEventStatus } from "@utils/event";
import { useMemo } from "react";
import { Event } from "types/event";
import { motion } from "framer-motion";

interface Props {
  events?: Event[];
  isLoading?: boolean;
}

const EventMap = ({ events, isLoading }: Props) => {
  const isMobile = useIsMobile();

  const activeEvents = useMemo(
    () => events?.filter((event) => !getEventStatus(event).isPast),
    [events],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-full h-[67vh]"
    >
      <Map zoom={isMobile ? 6 : 7} isLoading={isLoading}>
        {activeEvents?.map((event) => (
          <EventMarker event={event} key={event.id} />
        ))}
      </Map>
    </motion.div>
  );
};

export { EventMap };

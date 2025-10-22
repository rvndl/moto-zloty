import { useMemo } from "react";
import { Event } from "types/event";
import Logo from "@assets/img/mz-logo-black.png";
import { groupEventsByWeek } from "@utils/event";
import { EventCard } from "./event-card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  events?: Event[];
  emptyRedirectTo?: string;
  emptyText?: string;
}

const EventList = ({
  events,
  emptyRedirectTo = "/",
  emptyText = "Dostosuj filtry, aby wyszukać inne wydarzenia",
}: Props) => {
  const router = useRouter();
  const groupedEvents = useMemo(() => groupEventsByWeek(events), [events]);

  if (events?.length === 0) {
    return (
      <div className="flex flex-col items-center w-full h-full">
        <div className="mt-24 w-96">
          <Image
            src={Logo.src}
            alt="Moto Zloty"
            title="Moto Zloty"
            className="cursor-pointer"
            onClick={() => router.push(emptyRedirectTo)}
            width={512}
            height={203}
          />
          <div className="mt-6 leading-5">
            <h2 className="text-2xl font-bold">Brak wydarzeń</h2>
            <p className="font-medium text-muted">{emptyText}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="grid gap-6"
    >
      {Object.keys(groupedEvents)?.map((weekRange) => (
        <section key={weekRange}>
          <h2 className="text-xl font-bold md:text-2xl">
            {weekRange}{" "}
            <span className="text-sm font-normal md:text-base text-muted">
              ({groupedEvents[weekRange]?.length} wydarzeń)
            </span>
          </h2>
          <div className="grid w-full grid-cols-2 gap-2 mt-2 md:gap-4 lg:grid-cols-3">
            {groupedEvents[weekRange]?.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
};

export { EventList };

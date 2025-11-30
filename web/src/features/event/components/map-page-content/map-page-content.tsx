import { useEventCarouselQuery, useMapQuery } from "@features/event/api";
import { EventsCarousel } from "./events-carousel";
import { EventMap } from "./event-map/map";
import { Button } from "@components/button";
import { Accent1 } from "@components/polka-dot/accent-1";
import { Motorcycle } from "@components/polka-dot/motorcycle";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MapPageContent = () => {
  const { data: events, isLoading, isFetching } = useMapQuery();
  const { data: carouselEvents } = useEventCarouselQuery();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 mt-10 md:mt-20">
        <section className="relative p-4 md:p-0">
          <span className="w-96 absolute -top-14 -left-14 opacity-50 pointer-events-none">
            <Motorcycle />
          </span>

          <hgroup className="z-10">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              className="font-bold text-5xl"
            >
              Odkrywaj i Twórz
              <br />
              <span className="font-medium">Motocyklowe Zloty w Polsce.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              className="text-muted mt-6"
            >
              Najprostszy sposób na tworzenie i odkrywanie motocyklowych zlotów,
              tras i spotkań w całej Polsce.
              <br />
              <br />
              Od lokalnych przejażdżek po duże ogólnopolskie wydarzenia –
              planuj, dołączaj i dziel się pasją z innymi motocyklistami. <br />
              Mapa, lista, społeczność – wszystko w jednym miejscu.
            </motion.p>
          </hgroup>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mt-12 justify-end"
          >
            <Button variant="ghost">Stwórz wydarzenie</Button>
            <Link href="/lista-wydarzen">
              <Button>Przeglądaj wydarzenia</Button>
            </Link>
          </motion.div>
        </section>

        <section className="aspect-square relative">
          <span className="size-24 absolute -left-8 -bottom-8">
            <Accent1 />
          </span>
          <span className="size-24 absolute -right-8 -top-8">
            <Accent1 />
          </span>
          <EventMap events={events} isLoading={isLoading || isFetching} />
        </section>
      </div>

      <div className="flex flex-col gap-1 my-6">
        <h2 className="font-semibold text-lg">Nadchodzące wydarzenia</h2>
        <EventsCarousel events={carouselEvents} />
      </div>
    </div>
  );
};

export { MapPageContent };

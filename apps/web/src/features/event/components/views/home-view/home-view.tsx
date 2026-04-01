import { api, useQuery } from "api/eden";
import { EventsCarousel } from "./events-carousel";
import { EventMap } from "./event-map/map";
import { Button } from "@components/button";
import { Accent1 } from "@components/polka-dot/accent-1";
import { Motorcycle } from "@components/polka-dot/motorcycle";
import Link from "next/link";

export const MAP_QUERY_KEY = "MAP_QUERY_KEY";
export const CAROUSEL_QUERY_KEY = "CAROUSEL_QUERY_KEY";

const HomeView = () => {
  const {
    data: events,
    isLoading,
    isFetching,
  } = useQuery([MAP_QUERY_KEY], () => api.map.get({ query: {} }));

  const { data: carouselEvents } = useQuery([CAROUSEL_QUERY_KEY], () =>
    api.events.carousel.get(),
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 mt-10 md:mt-20">
        <section className="relative p-4 md:p-0">
          <span className="w-96 absolute -top-14 -left-14 opacity-50 pointer-events-none">
            <Motorcycle />
          </span>

          <hgroup className="z-10">
            <h1 className="font-bold text-5xl">
              Odkrywaj i Twórz
              <br />
              <span className="font-medium">Motocyklowe Zloty w Polsce.</span>
            </h1>

            <p className="text-muted mt-6">
              Najprostszy sposób na tworzenie i odkrywanie motocyklowych zlotów,
              tras i spotkań w całej Polsce.
              <br />
              <br />
              Od lokalnych przejażdżek po duże ogólnopolskie wydarzenia –
              planuj, dołączaj i dziel się pasją z innymi motocyklistami. <br />
              Mapa, lista, społeczność – wszystko w jednym miejscu.
            </p>
          </hgroup>

          <div className="flex items-center gap-2 mt-12 justify-end">
            <Link href="/wydarzenie/stworz" title="Stwórz wydarzenie">
              <Button variant="ghost">Stwórz wydarzenie</Button>
            </Link>
            <Link href="/lista-wydarzen" title="Przeglądaj wydarzenia">
              <Button>Przeglądaj wydarzenia</Button>
            </Link>
          </div>
        </section>

        <section className="aspect-square relative">
          <span className="size-24 absolute -left-8 -bottom-8">
            <Accent1 />
          </span>
          <span className="size-24 absolute -right-8 -top-8 rotate-90">
            <Accent1 />
          </span>
          <EventMap events={events} isLoading={isLoading || isFetching} />
        </section>
      </div>

      <div className="flex flex-col gap-1 my-6 mx-2 md:mx-0">
        <h2 className="font-semibold text-lg">Nadchodzące wydarzenia</h2>
        <EventsCarousel events={carouselEvents} />
      </div>
    </div>
  );
};

export { HomeView };

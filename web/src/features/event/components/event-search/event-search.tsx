import { Autocomplete } from "@components";
import { Api } from "api";
import { useRouter } from "next/router";
import { Event } from "types/event";
import { EventSearchItem } from "./event-search-item";

const EventSearch = () => {
  const router = useRouter();

  return (
    <Autocomplete
      placeholder="Wyszukaj..."
      className="w-auto sm:focus:w-72 md:focus:w-80 lg:focus:w-96"
      fetch={async (query) => {
        const res = await Api.get<Event[]>(`/events/search/${query}`);
        return res.data?.map((event) => ({
          id: event.id,
          label: event.name,
          value: event,
        }));
      }}
      onChange={(option) => option?.id && router.push(`/event/${option.id}`)}
      transformer={(option, query) => (
        <EventSearchItem option={option} query={query} />
      )}
    />
  );
};

export { EventSearch };

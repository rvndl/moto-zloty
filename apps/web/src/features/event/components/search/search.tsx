import { Autocomplete } from "@components/autocomplete";
import { api } from "api/eden";
import { useRouter } from "next/router";
import { EventSearchItem } from "./search-item";

const EventSearch = () => {
  const router = useRouter();

  return (
    <Autocomplete
      placeholder="Wyszukaj wydarzenie..."
      fetch={async (query) => {
        const res = await api.events.search({ query }).get();
        return (
          res.data?.map((event) => ({
            id: event.id,
            label: event.name,
            value: event,
          })) ?? []
        );
      }}
      onChange={(option) =>
        option?.id && router.push(`/wydarzenie/${option.id}`)
      }
      transformer={(option, query) => (
        <EventSearchItem option={option} query={query} />
      )}
    />
  );
};

export { EventSearch };

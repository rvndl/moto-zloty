import { getFilePath } from "@utils/index";
import { Metadata } from "@components/metadata";
import { useRouter } from "next/router";
import { api, useQuery } from "api/eden";
import { DetailsView } from "../components/views/details-view";
import { Event } from "../types";

export const EVENT_QUERY_KEY = "EVENT_QUERY_KEY";

const DetailsPage = () => {
  const {
    query: { id },
  } = useRouter();

  const { data: event } = useQuery(
    [EVENT_QUERY_KEY, id],
    () => api.events({ id: id as string }).get(),
    { enabled: Boolean(id) },
  );

  return (
    <>
      {event && (
        <Metadata
          title={event.name}
          description={event.description ?? undefined}
          canonical={`/wydarzenie/${id}`}
          structuredData={{
            headline: event.name,
            datePublished: event.createdAt ?? undefined,
            image: getFilePath(event.bannerSmallId ?? event.bannerId),
            author: {
              name: event.account?.username,
              url: `/uzytkownik/${event.accountId}`,
            },
          }}
        />
      )}

      <DetailsView event={event as Event} />
    </>
  );
};

export { DetailsPage };

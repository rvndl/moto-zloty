import { getServerSideSitemapLegacy, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";
import { Api } from "api";
import { EventsResponse } from "@features/event/api/types/event";
import { states } from "@features/event/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const events = (await Api.get<EventsResponse>("/sitemap_events")).data;

  const now = new Date();

  const upcomingEvents = events.filter(
    (event) => new Date(event.date_from) > now
  );
  const maxUpcomingDiff =
    upcomingEvents.length > 0
      ? Math.max(
          ...upcomingEvents.map(
            (event) => new Date(event.date_from).getTime() - now.getTime()
          )
        )
      : 0;

  const eventFields: ISitemapField[] = events.map((event) => {
    const start = new Date(event.date_from);
    const end = new Date(event.date_to);
    let priority: number;

    if (start <= now && now < end) {
      priority = 1;
    } else if (start > now) {
      const diff = start.getTime() - now.getTime();
      priority = maxUpcomingDiff > 0 ? 1 - diff / maxUpcomingDiff : 0;
    } else {
      priority = 0;
    }

    return {
      loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/wydarzenie/${event.id}`,
      lastmod: event.created_at,
      changefreq: "daily",
      priority: parseFloat(priority.toFixed(2)),
    };
  });

  const stateFields: ISitemapField[] = states.map((state) => ({
    loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/lista-wydarzen/${state}`,
    changefreq: "daily",
    priority: 0.8,
  }));

  // next sitemap generator doesn't support dynamic routes with params
  const eventList: ISitemapField = {
    loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/lista-wydarzen`,
    changefreq: "daily",
    priority: 0.8,
  };

  return getServerSideSitemapLegacy(ctx, [
    ...eventFields,
    eventList,
    ...stateFields,
  ]);
};

export default function Sitemap() {}

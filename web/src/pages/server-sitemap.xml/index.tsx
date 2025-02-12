import { getServerSideSitemapLegacy, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";
import { getEventCarouselQuery } from "@features/event/api";

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const events = await getEventCarouselQuery();
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

  const fields: ISitemapField[] = events.map((event) => {
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
      loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/event/${event.id}`,
      lastmod: event.created_at,
      changefreq: "daily",
      priority: parseFloat(priority.toFixed(2)),
    };
  });

  return getServerSideSitemapLegacy(ctx, fields);
};

export default function Sitemap() {}

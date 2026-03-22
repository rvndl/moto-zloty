import { getServerSideSitemapLegacy, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";
import { months, states } from "@features/event/utils";
import { api } from "api/eden";

const YEARS = [2025];

// eslint-disable-next-line react-refresh/only-export-components
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const events = (await api.sitemapEvents.get()).data;

  const eventFields: ISitemapField[] =
    events?.map((event) => ({
      loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/wydarzenie/${event.id}`,
      lastmod: event.createdAt
        ? new Date(event.createdAt).toISOString()
        : undefined,
      changefreq: "daily",
      priority: 1,
    })) ?? [];

  const stateFields: ISitemapField[] = states.map((state) => ({
    loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/lista-wydarzen/${encodeURIComponent(state)}`,
    changefreq: "daily",
    priority: 1,
  }));

  const monthFields: ISitemapField[] = months.map((month) => ({
    loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/lista-wydarzen/miesiac/${encodeURIComponent(month)}`,
    changefreq: "daily",
    priority: 1,
  }));

  const archiveFields: ISitemapField[] = YEARS.map((year) => ({
    loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/lista-wydarzen/${year}`,
    changefreq: "weekly",
    priority: 0.9,
  }));

  // next sitemap generator doesn't support dynamic routes with params
  const eventList: ISitemapField = {
    loc: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/lista-wydarzen`,
    changefreq: "daily",
    priority: 1,
  };

  return getServerSideSitemapLegacy(ctx, [
    ...eventFields,
    eventList,
    ...stateFields,
    ...monthFields,
    ...archiveFields,
  ]);
};

export default function Sitemap() {}

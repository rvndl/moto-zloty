import { stripHtml } from "string-strip-html";
import Head from "next/head";
import { truncate } from "lodash";

interface StructuredData {
  headline?: string;
  image?: string;
  datePublished?: string;
  author?: {
    name?: string;
    url: string;
  };
}

interface Props {
  title: string;
  description?: string;
  canonical?: string;
  structuredData?: StructuredData;
}

const Metadata = ({ title, description, canonical, structuredData }: Props) => {
  const siteUrl = process.env.NEXT_PUBLIC_PUBLIC_URL;
  const strippedDescription = truncate(stripHtml(description ?? "").result, {
    length: 160,
    omission: "...",
  });

  const structuredDataJson =
    structuredData &&
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: structuredData.headline,
      image: [structuredData.image],
      datePublished: structuredData.datePublished,
      author: [
        {
          "@type": "Person",
          name: structuredData?.author?.name,
          url: structuredData?.author?.url,
        },
      ],
    });

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="title" />
      <meta property="og:title" content={title} />
      {description && (
        <>
          <meta name="description" content={strippedDescription} />
          <meta property="og:description" content={strippedDescription} />
        </>
      )}
      {canonical !== undefined && (
        <>
          <link rel="canonical" href={siteUrl + canonical} />
          <meta property="og:url" content={siteUrl + canonical} />
        </>
      )}
      {structuredData && (
        <>
          <script type="application/ld+json">{structuredDataJson}</script>
        </>
      )}
    </Head>
  );
};

export { Metadata };

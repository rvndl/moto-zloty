import { stripHtml } from "string-strip-html";
import Head from "next/head";
import { truncate } from "lodash";

interface Props {
  title: string;
  description?: string;
  canonical?: string;
}

const Metadata = ({ title, description, canonical }: Props) => {
  const siteUrl = process.env.NEXT_PUBLIC_PUBLIC_URL;
  const strippedDescription = truncate(stripHtml(description ?? "").result, {
    length: 160,
    omission: "...",
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
    </Head>
  );
};

export { Metadata };

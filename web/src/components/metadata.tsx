import { stripHtml } from "string-strip-html";
import Head from "next/head";

interface Props {
  title: string;
  description?: string;
  canonical?: string;
}

const Metadata = ({ title, description, canonical }: Props) => {
  const siteUrl = process.env.NEXT_PUBLIC_PUBLIC_URL;
  const strippedDescription = stripHtml(description ?? "").result;
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="title" />
      {description && (
        <>
          <meta name="description" content={strippedDescription} />
          <meta property="og:description" content={strippedDescription} />
        </>
      )}
      {canonical !== undefined && (
        <link rel="canonical" href={siteUrl + canonical} />
      )}
    </Head>
  );
};

export { Metadata };

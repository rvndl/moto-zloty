import { stripHtml } from "string-strip-html";
import Head from "next/head";

interface Props {
  title: string;
  description?: string;
}

const Metadata = ({ title, description }: Props) => {
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
    </Head>
  );
};

export { Metadata };

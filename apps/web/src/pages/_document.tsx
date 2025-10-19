import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="pl">
      <Head>
        <meta
          name="keywords"
          content="zloty, zlot, motocykl, motocykle, zloty motocyklowe, zloty motocyklowy, imprezy motocyklowe, zloty motocyklowe 2025, zlot motocykli"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pl_PL" />
        <meta property="og:site_name" content="Moto Zloty" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Zloty Motocyklowe 2025 – Imprezy i Wydarzenia w Polsce"
        />
        <meta
          name="twitter:description"
          content="Wszystkie zloty motocyklowe, wydarzenia i imprezy w Polsce w jednym miejscu! Sprawdź, co dzieje się w Twojej okolicy i dołącz już dziś!"
        />
        <meta
          name="twitter:image"
          content="https://www.moto-zloty.pl/event-placeholder.png"
        />
        <meta
          property="og:image"
          content="https://www.moto-zloty.pl/event-placeholder.png"
        />
        <meta name="twitter:site" content="@rvn_dl" />
        <meta name="twitter:creator" content="@rvn_dl" />
      </Head>
      <body>
        <div id="root">
          <Main />
          <NextScript />
        </div>
        <div id="headlessui-portal-root"></div>
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid={process.env.NEXT_PUBLIC_COOKIEBOT_API_KEY}
          type="text/javascript"
          strategy="beforeInteractive"
        />
      </body>
    </Html>
  );
}

import "../globals.css";
import "react-tooltip/dist/react-tooltip.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Layout } from "@components/layout";
import { DefaultToastOptions, Toaster } from "react-hot-toast";
import { useState } from "react";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "next-google-adsense";

const toastOptions: DefaultToastOptions = {
  style: {
    background: "#000",
    color: "#fff",
  },
  iconTheme: {
    primary: "#52b629",
    secondary: "#fff",
  },
};

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
};

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <>
      <GoogleAdSense />
      <GoogleAnalytics trackPageViews defaultConsent="denied" />

      <QueryClientProvider client={queryClient}>
        <PagesTopLoader />

        <Layout>
          <Component {...pageProps} />
        </Layout>

        <Toaster
          position="bottom-right"
          containerStyle={{ zIndex: 99999 }}
          toastOptions={toastOptions}
        />
      </QueryClientProvider>
    </>
  );
};

export default App;

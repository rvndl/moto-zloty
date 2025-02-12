import "../globals.css";
import "leaflet/dist/leaflet.css";
import "react-tooltip/dist/react-tooltip.css";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@components";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { GoogleAdSense } from "next-google-adsense";

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <>
      <GoogleAdSense />
      <GoogleAnalytics trackPageViews defaultConsent="denied" />
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="bottom-right"
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            style: {
              background: "#000",
              color: "#fff",
            },
            iconTheme: {
              primary: "#52b629",
              secondary: "#fff",
            },
          }}
        />
        <PagesTopLoader />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </>
  );
};

export default App;

import "../globals.css";
import "leaflet/dist/leaflet.css";
import "react-tooltip/dist/react-tooltip.css";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@components";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps) => (
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
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </QueryClientProvider>
);

export default MyApp;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components";
import { Home } from "./views";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { setupYup } from "utils/yup";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

function App() {
  useEffect(() => {
    setupYup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </QueryClientProvider>
  );
}

export default App;

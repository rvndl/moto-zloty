import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components";
import { Home } from "./views";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { setupYup } from "utils/yup";
import { Toaster } from "react-hot-toast";
import { ProfilePage } from "@features/profile";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "*",
    element: <Root />,
  },
]);

function App() {
  useEffect(() => {
    setupYup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster containerStyle={{ zIndex: 99999 }} />
    </QueryClientProvider>
  );
}

function Root() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
}

export default App;

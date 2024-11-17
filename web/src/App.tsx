import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import { useEffect } from "react";
import { setupYup } from "utils/yup";
import { Toaster } from "react-hot-toast";
import { ProfilePage } from "@features/profile";
import { EventPage, EventsPage } from "@features/event";
import { ModerationPage } from "@features/moderation";

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
      <Toaster position="bottom-right" containerStyle={{ zIndex: 99999 }} />
    </QueryClientProvider>
  );
}

function Root() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/moderation/" element={<ModerationPage />} />
      </Routes>
    </Layout>
  );
}

export default App;

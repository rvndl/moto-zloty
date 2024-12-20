import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { EventPage, EventsPage } from "@features/event";
import { lazy, Suspense } from "react";
import { NotFoundPage } from "pages";
import { ContactPage } from "@features/contact";
import { AccountPage } from "@features/account";

const queryClient = new QueryClient();

const ModerationPage = lazy(() =>
  import("@features/moderation").then((mod) => ({
    default: mod.ModerationPage,
  }))
);

const router = createBrowserRouter([
  {
    path: "*",
    element: <Root />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
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
    </QueryClientProvider>
  );
}

function Root() {
  return (
    <Layout>
      <Routes>
        <Route index path="/" element={<EventsPage />} />
        <Route path="/account/:id" element={<AccountPage />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route
          path="/moderation/"
          element={
            <Suspense>
              <ModerationPage />
            </Suspense>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export default App;

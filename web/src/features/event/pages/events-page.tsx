import { Metadata, Page } from "@components";
import { CreateEventDialog, EventsPageContent } from "../components";
import { LoginDialog, useAuth } from "@features/auth";
import { PlusIcon } from "lucide-react";

const EventsPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Metadata
        title="Moto Zloty - Wszystkie zloty motocyklowe w Polsce!"
        description="Lista wszystkich zlotów motocyklowych w polsce! Wyszukaj najbliższe wydarzenie motocyklowe już dzisiaj!"
        canonical=""
      />
      <Page
        title="Wydarzenia"
        headerContent={
          isAuthenticated ? (
            <CreateEventDialog />
          ) : (
            <LoginDialog
              label="Dodaj"
              buttonProps={{ variant: "primary", icon: <PlusIcon /> }}
            />
          )
        }
      >
        <EventsPageContent />
      </Page>
    </>
  );
};

export { EventsPage };

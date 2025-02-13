import { Metadata, Page, PlusIcon } from "@components";
import { CreateEventDialog, EventsPageContent } from "../components";
import { LoginDialog, useAuth } from "@features/auth";

const EventsPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Metadata
        title="Moto Zloty - Wszystkie zloty motocyklowe w Polsce - znajdź zlot motocyklowy już teraz!"
        description="Lista wszystkich zlotów motocyklowych w polsce! Wyszukaj najbliższe wydarzenie motocyklowe już dzisiaj!"
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

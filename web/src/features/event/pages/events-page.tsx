import { Page, PlusIcon } from "@components";
import { CreateEventDialog, EventsPageContent } from "../components";
import { LoginDialog, useAuth } from "@features/auth";

const EventsPage = () => {
  const { isAuthenticated } = useAuth();

  return (
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
  );
};

export { EventsPage };

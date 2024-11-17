import { Page } from "@components/page";
import { CreateEventDialog, EventsPageContent } from "../components";
import { LoginDialog, useAuth } from "@features/auth";
import { PlusIcon } from "@components/icons";

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

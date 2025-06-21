import { Metadata, Page } from "@components";
import { CreateEventDialog, MapPageContent } from "../components";
import { LoginDialog, useAuth } from "@features/auth";
import { PlusIcon } from "lucide-react";

const MapPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Metadata
        title="Moto Zloty - Wszystkie zloty motocyklowe w Polsce!"
        description="Lista wszystkich zlotów motocyklowych w polsce! Wyszukaj najbliższe wydarzenie motocyklowe już dzisiaj!"
        canonical=""
      />
      <Page
        title="Mapa wydarzeń"
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
        <MapPageContent />
      </Page>
    </>
  );
};

export { MapPage };

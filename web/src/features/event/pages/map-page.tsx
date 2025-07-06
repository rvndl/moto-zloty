import { Button, Metadata, Page } from "@components";
import { CreateEventDialog, MapPageContent } from "../components";
import { useAuth } from "@features/auth";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

const MapPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

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
            <Button
              icon={<PlusIcon />}
              onClick={() => router.push("/logowanie")}
            >
              Dodaj wydarzenie
            </Button>
          )
        }
      >
        <MapPageContent />
      </Page>
    </>
  );
};

export { MapPage };

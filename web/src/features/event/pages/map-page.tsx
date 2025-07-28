import { CreateEventDialog, MapPageContent } from "../components";
import { useAuth } from "@features/auth";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { Metadata } from "@components/metadata";
import { Page } from "@components/page";
import { Button } from "@components/button";

const MapPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <>
      <Metadata
        title="Moto Zloty - Wszystkie zloty, imprezy motocyklowe w Polsce!"
        description="Wszystkie zloty motocyklowe, wydarzenia i imprezy w Polsce w jednym miejscu! Sprawdź, co dzieje się w Twojej okolicy i dołącz już dziś!"
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
              Dodaj
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

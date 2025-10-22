import { MapPageContent } from "../components";
import { Metadata } from "@components/metadata";
import { Page } from "@components/page";

const MapPage = () => {
  return (
    <>
      <Metadata
        title="Moto Zloty - Wszystkie zloty, imprezy motocyklowe w Polsce!"
        description="Wszystkie zloty motocyklowe, wydarzenia i imprezy w Polsce w jednym miejscu! Sprawdź, co dzieje się w Twojej okolicy i dołącz już dziś!"
      />
      <Page title="Mapa wydarzeń">
        <MapPageContent />
      </Page>
    </>
  );
};

export { MapPage };

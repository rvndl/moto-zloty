import { Metadata } from "@components/metadata";
import { MapView } from "../components";
import { Page } from "@components/page";

const MapPage = () => {
  return (
    <>
      <Metadata
        title="Moto Zloty - Mapa wydarzeń"
        description="Znajdź zloty motocyklowe, wydarzenia i imprezy w Polsce na naszej interaktywnej mapie! Sprawdź, co dzieje się w Twojej okolicy i dołącz już dziś!"
        canonical="/mapa"
      />
      <Page
        title="Mapa wydarzeń"
        breadcrumbs={[
          {
            label: "Mapa wydarzeń",
            to: "/mapa",
            isActive: true,
          },
        ]}
      >
        <MapView />
      </Page>
    </>
  );
};

export { MapPage };

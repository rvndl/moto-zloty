import { Metadata } from "@components/metadata";
import { HomeView } from "../components";

const HomePage = () => {
  return (
    <>
      <Metadata
        title="Moto Zloty - Wszystkie zloty, imprezy motocyklowe w Polsce!"
        description="Wszystkie zloty motocyklowe, wydarzenia i imprezy w Polsce w jednym miejscu! Sprawdź, co dzieje się w Twojej okolicy i dołącz już dziś!"
        canonical=""
      />
      <HomeView />
    </>
  );
};

export { HomePage };

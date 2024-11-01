import { Map } from "@components/map";
import { Event } from "@features/event";

const Home = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-row w-full">
        <h2>Najbliższe wydarzenia</h2>
      </div>
      <section className="flex pb-6 overflow-x-auto overflow-y-hidden gap-x-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <Event key={i} />
        ))}
      </section>
      <section className="w-full h-full bg-red-100 border rounded-lg shadow-sm">
        <Map />
      </section>
    </div>
  );
};

export { Home };

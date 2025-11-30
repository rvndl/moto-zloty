import { getFilePath } from "@utils/index";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Event } from "types/event";
import { DescriptionList } from "./description-list";

interface Props {
  event: Event;
}

const Header = ({ event }: Props) => {
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    setTimeout(() => setOpacity(1), 0);
  }, []);

  return (
    <div className="h-[30vh] relative flex items-end justify-center bg-black">
      <Image
        src={getFilePath(event.banner_id)}
        alt={event.name}
        style={{
          maskImage: `linear-gradient(
            to top,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1)
          )`,
        }}
        className={clsx(
          "h-full w-full object-cover grayscale pointer-events-none transition duration-500 brightness-50 absolute",
          opacity === 1 ? "opacity-60" : "opacity-0",
        )}
        width={1200}
        height={630}
        priority
      />
      <section className="max-w-7xl z-10 w-full flex flex-col gap-8 mb-12 sm:px-6 lg:px-8">
        <hgroup className="flex flex-col gap-6 w-full max-w-[50%] text-white">
          <h1>{event.name}</h1>
          <p className="opacity-70">
            Dołącz do nas na zakończenie sezonu motocyklowego w Gietrzwaldzie.
            Ostatnia okazja w tym roku na wspólne spotkanie, wymianę doświadczeń
            i niezapomniane chwile na dwóch kołach.
          </p>
        </hgroup>
        <DescriptionList event={event} />
      </section>
    </div>
  );
};

export { Header };

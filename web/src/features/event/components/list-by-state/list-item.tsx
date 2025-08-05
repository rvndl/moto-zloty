import { format } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import { useMemo } from "react";
import { stripHtml } from "string-strip-html";
import { twMerge } from "tailwind-merge";
import { Event } from "types/event";

interface Props {
  event: Event;
  variant?: "ghost" | "alternative";
}

const ListItem = ({ event, variant = "ghost" }: Props) => {
  const strippedDescription = useMemo(
    () => stripHtml(event.description).result,
    [event.description],
  );

  return (
    <li
      className={twMerge(
        "hover:bg-white/15 hover:outline outline-white/20 outline-2  rounded-lg p-0.5",
        variant === "alternative" && " outline outline-1 outline-black/10",
      )}
    >
      <article id={`wydarzenie-${event.id}`}>
        <Link href={`/wydarzenie/${event.id}`} className="flex gap-2 w-full">
          <div
            className={twMerge(
              "rounded-md bg-white aspect-square w-10 h-10 flex flex-col items-center justify-center text-black font-medium leading-none",
              variant === "alternative" && "bg-black text-white",
            )}
          >
            <p className="text-sm leading-none uppercase">
              {format(event.date_from, "MMM", { locale: pl })}
            </p>
            <p className="text-xl leading-none">
              {format(event.date_from, "dd", { locale: pl })}
            </p>
          </div>
          <div className="flex flex-col gap-1.5 leading-none truncate font-medium">
            <h3 className="truncate">{event.name}</h3>
            <p className="opacity-90 text-sm truncate leading-4">
              {strippedDescription}
            </p>
          </div>
        </Link>
      </article>
    </li>
  );
};

export { ListItem };

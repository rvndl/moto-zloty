import Link from "next/link";
import { Children, PropsWithChildren } from "react";
import { Event } from "types/event";

interface Props {
  state: string;
  events?: Event[];
}

const StateList = ({ state, children }: PropsWithChildren<Props>) => {
  const isEmpty = Children.count(children) === 0;
  const hasMore = Children.count(children) >= 4;

  return (
    <div className="w-full">
      <h2 className="font-medium text-xl capitalize">
        <Link href={`/lista-wydarzen/${state.toLowerCase()}`}>{state}</Link>
      </h2>
      <ol className="mt-4 w-full flex flex-col gap-1.5">
        {isEmpty ? (
          <p className="text-muted font-semibold">Brak wydarzeń</p>
        ) : (
          <>
            {children}
            {hasMore && (
              <li className="text-muted font-semibold">
                <Link href={`/lista-wydarzen/${state.toLowerCase()}`}>
                  I więcej...
                </Link>
              </li>
            )}
          </>
        )}
      </ol>
    </div>
  );
};

export { StateList };

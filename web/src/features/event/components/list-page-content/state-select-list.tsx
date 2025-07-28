import { Button } from "@components/button";
import { getStateAssociatedIcon, states } from "@features/event/utils";
import clsx from "clsx";
import Link from "next/link";

interface Props {
  activeState?: string;
}

const StateSelectList = ({ activeState }: Props) => (
  <div className="mt-6 md:mt-0 bg-white rounded-lg h-min shadow-sm border p-4">
    <hgroup>
      <h2 className="text-xl font-semibold">Województwo</h2>
      <p className="text-muted text-sm">
        Wybierz województwo, aby wyświetlić zloty w tym regionie.
      </p>
    </hgroup>
    <ol className="mt-4">
      {states.map((state) => (
        <li key={state} className={clsx("text-primary text-opacity-90 ml-0.5")}>
          <Link href={`/lista-wydarzen/${encodeURIComponent(state)}`}>
            <Button
              variant={activeState === state ? "primary" : "ghost"}
              className="capitalize w-full"
              textAlignment="left"
              icon={getStateAssociatedIcon(state)}
            >
              {state}
            </Button>
          </Link>
        </li>
      ))}
    </ol>
  </div>
);

export { StateSelectList };

import { Button } from "@components/button";
import { getMonthAssociatedIcon, months } from "@features/event/utils";
import clsx from "clsx";

import Link from "next/link";

const thisYear = new Date().getFullYear();

interface Props {
  activeMonth?: string;
}

const MonthSelectList = ({ activeMonth }: Props) => (
  <div className="md:mt-0 bg-white rounded-lg h-min shadow-sm border p-4">
    <hgroup>
      <h2 className="text-xl font-semibold">Zloty motocyklowe {thisYear}</h2>
      <p className="text-muted text-sm">
        Wybierz miesiąc, aby wyświetlić zloty w tym miesiącu.
      </p>
    </hgroup>
    <ol className="mt-4">
      {months.map((month) => {
        const monthString = `${month} ${thisYear}`;

        return (
          <li
            key={month}
            className={clsx("text-primary text-opacity-90 ml-0.5")}
          >
            <Link
              href={`/lista-wydarzen/miesiac/${encodeURIComponent(month)}`}
              title={monthString}
            >
              <Button
                variant={activeMonth === month ? "primary" : "ghost"}
                className="capitalize w-full"
                textAlignment="left"
                icon={getMonthAssociatedIcon(month)}
              >
                {monthString}
              </Button>
            </Link>
          </li>
        );
      })}
    </ol>
  </div>
);

export { MonthSelectList };

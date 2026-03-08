import { Date as DateComponent } from "@components/date";
import { makeAddressString } from "@features/event/utils";
import { isSameDay } from "date-fns";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { type Event } from "@features/event/types";

interface Props {
  event: Event;
}

const DescriptionList = ({ event }: Props) => {
  const isMultiDay =
    event.dateTo &&
    !isSameDay(new Date(event.dateFrom), new Date(event.dateTo));

  return (
    <dl className="flex gap-6 text-white">
      <div className="flex gap-2 items-center">
        <CalendarIcon className="opacity-90" size={20} />
        <div className="flex flex-col">
          <dt className="opacity-70">Data</dt>
          <dd className="capitalize">
            {isMultiDay ? (
              <span className="flex gap-1">
                <DateComponent date={event.dateFrom} type="daymonth" tooltip />
                <span>-</span>
                <DateComponent date={event.dateTo!} type="daymonth" tooltip />
              </span>
            ) : (
              <DateComponent date={event.dateFrom} type="daymonth" tooltip />
            )}
          </dd>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <MapPinIcon className="opacity-90" size={20} />
        <div className="flex flex-col">
          <dt className="opacity-70">Lokalizacja</dt>
          <dd>
            <a
              href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {makeAddressString(event.fullAddress)}
            </a>
          </dd>
        </div>
      </div>
    </dl>
  );
};

export { DescriptionList };

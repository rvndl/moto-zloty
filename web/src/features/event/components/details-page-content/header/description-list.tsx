import { Date } from "@components/date";
import { makeAddressString } from "@features/event/utils";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Event } from "types/event";

interface Props {
  event: Event;
}

const DescriptionList = ({ event }: Props) => {
  return (
    <dl className="flex gap-6 text-white">
      <div className="flex gap-2 items-center">
        <CalendarIcon className="opacity-90" size={20} />
        <div className="flex flex-col">
          <dt className="opacity-70">Data</dt>
          <dd className="capitalize">
            <Date date={event.date_from} type="daymonth" tooltip />
          </dd>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <MapPinIcon className="opacity-90" size={20} />
        <div className="flex flex-col">
          <dt className="opacity-70">Lokalizacja</dt>
          <dd>{makeAddressString(event.full_address)}</dd>
        </div>
      </div>
    </dl>
  );
};

export { DescriptionList };

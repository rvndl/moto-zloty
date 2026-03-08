import { makeAddressString } from "@features/event/utils";
import { type Event } from "@features/event/types";

interface Props {
  event?: Event;
}

const Location = ({ event }: Props) => {
  return (
    <div className="flex flex-wrap items-center w-full gap-2 shrink-0 decoration-dotted underline">
      <a
        href={`https://maps.google.com/?q=${event?.latitude},${event?.longitude}`}
        target="_blank"
        rel="noreferrer"
        data-tooltip-id="map-icon-tooltip"
        data-tooltip-content="Otwórz w mapach Google"
      >
        {makeAddressString(event?.fullAddress)}
      </a>
    </div>
  );
};

export { Location };

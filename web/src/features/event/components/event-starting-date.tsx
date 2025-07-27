import { Badge } from "@components/badge";
import { Tooltip } from "@components/tooltip";
import { Value } from "@components/value";
import { getEventStatus } from "@utils/event";
import { format, formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { useMemo } from "react";
import { type Event } from "types/event";

interface Props {
  event?: Event;
  isLoading?: boolean;
}

const EventStartingDate = ({ event, isLoading }: Props) => {
  const { isOngoing } = useMemo(() => getEventStatus(event), [event]);

  const distance = useMemo(() => {
    if (!event?.date_from) {
      return "";
    }

    return formatDistance(event?.date_from, new Date(), {
      locale: pl,
      addSuffix: true,
    });
  }, [event?.date_from]);

  return (
    <div>
      <Value
        title="Rozpoczęcie"
        data-tooltip-id="starting-date-tooltip"
        data-tooltip-content={format(
          event?.date_from ?? new Date(),
          "dd.MM.yyyy HH:mm",
        )}
        isLoading={isLoading}
      >
        <time dateTime={event?.date_from}>
          {isOngoing ? (
            <Badge className="w-max" variant="danger">
              W trakcie
            </Badge>
          ) : (
            <p className="text-muted">{distance}</p>
          )}
        </time>
      </Value>
      <Tooltip id="starting-date-tooltip" />
    </div>
  );
};

export { EventStartingDate };

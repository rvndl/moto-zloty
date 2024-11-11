import { Tooltip, Value } from "@components";
import { Badge } from "@components/badge";
import { getEventStatus } from "@utils/event";
import { format, formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { useMemo } from "react";
import { type Event } from "types/event";

interface Props {
  event?: Event;
  isLoading?: boolean;
}

const EventEndingDate = ({ event, isLoading }: Props) => {
  const { isPast } = useMemo(() => getEventStatus(event), [event]);

  const distance = useMemo(() => {
    if (!event?.date_to) {
      return "";
    }

    return formatDistance(event?.date_to, new Date(), {
      locale: pl,
      addSuffix: true,
    });
  }, [event?.date_from]);

  return (
    <div>
      <Value
        title="Zakończenie"
        data-tooltip-id="ending-date-tooltip"
        data-tooltip-content={format(
          event?.date_to ?? new Date(),
          "dd.MM.yyyy HH:mm"
        )}
        isLoading={isLoading}
      >
        {isPast ? (
          <Badge className="w-max" variant="secondary">
            Zakończono
          </Badge>
        ) : (
          <p className="text-muted">{distance}</p>
        )}
      </Value>
      <Tooltip id="ending-date-tooltip" />
    </div>
  );
};

export { EventEndingDate };

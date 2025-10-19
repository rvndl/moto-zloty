import { Card } from "@components/card";
import Link from "next/link";
import { ListItem } from "../list-by-state/list-item";
import { useEventRelatedEventsQuery } from "@features/event/api";
import {
  getStateMetadata,
  getMonthMetadataByMonthNum,
  State,
  getShortState,
} from "@features/event/utils";

interface Props {
  eventId: string;
  monthNum: number;
  state: string;
}

const RelatedEvents = ({ eventId, monthNum, state }: Props) => {
  const { data } = useEventRelatedEventsQuery(
    { eventId, monthNum, state },
    { enabled: !!eventId },
  );

  const monthMetadata = getMonthMetadataByMonthNum(monthNum);
  const stateMetadata = getStateMetadata(state as State);

  const isRelatedByStateEmpty = data?.related_by_state.length === 0;
  const isRelatedByMonthEmpty = data?.related_by_month.length === 0;

  return (
    <>
      {!isRelatedByStateEmpty && (
        <Card
          title={`Więcej wydarzeń w ${getShortState(state)}`}
          description={stateMetadata?.relatedDesc}
          titleAs="h2"
          titleWrapper={(title) => (
            <Link href={`/lista-wydarzen/${encodeURIComponent(state)}`}>
              {title}
            </Link>
          )}
        >
          <ol className="gap-2.5 grid grid-cols-1 md:grid-cols-2">
            {data?.related_by_state.map((event) => (
              <ListItem key={event.id} event={event} variant="alternative" />
            ))}
          </ol>
        </Card>
      )}
      {!isRelatedByMonthEmpty && (
        <Card
          title={`Więcej wydarzeń w miesiącu ${monthMetadata?.month}`}
          description={monthMetadata?.relatedDesc}
          titleAs="h2"
          titleWrapper={(title) => (
            <Link
              href={`/lista-wydarzen/miesiac/${encodeURIComponent(monthMetadata?.month as string)}`}
            >
              {title}
            </Link>
          )}
        >
          <ol className="gap-2.5 grid grid-cols-1 md:grid-cols-2">
            {data?.related_by_month.map((event) => (
              <ListItem key={event.id} event={event} variant="alternative" />
            ))}
          </ol>
        </Card>
      )}
    </>
  );
};

export { RelatedEvents };

import { Card } from "@components/card";
import Link from "next/link";
import { api, useQuery } from "api/eden";
import {
  getStateMetadata,
  getMonthMetadataByMonthNum,
  State,
  getShortState,
} from "@features/event/utils";
import { ListItem } from "../../../state-list/list-item";

export const RELATED_EVENTS_QUERY_KEY = "RELATED_EVENTS_QUERY_KEY";

interface Props {
  eventId: string;
  monthNum: number;
  state: string;
}

const RelatedEvents = ({ eventId, monthNum, state }: Props) => {
  const { data } = useQuery(
    [RELATED_EVENTS_QUERY_KEY, eventId, monthNum, state],
    () =>
      api
        .events({ id: eventId })
        .listRelated({ month: monthNum.toString() })({ state })
        .get(),
    { enabled: !!eventId },
  );

  const monthMetadata = getMonthMetadataByMonthNum(monthNum);
  const stateMetadata = getStateMetadata(state as State);

  const isRelatedByStateEmpty = data?.relatedByState.length === 0;
  const isRelatedByMonthEmpty = data?.relatedByMonth.length === 0;

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
          <ol className="gap-2.5 grid grid-cols-1">
            {data?.relatedByState.map((event) => (
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
          <ol className="gap-2.5 grid grid-cols-1">
            {data?.relatedByMonth.map((event) => (
              <ListItem key={event.id} event={event} variant="alternative" />
            ))}
          </ol>
        </Card>
      )}
    </>
  );
};

export { RelatedEvents };

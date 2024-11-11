import { useParams } from "react-router-dom";
import { useEventQuery } from "../api";
import { Page } from "@components";
import { EventPageContent } from "../components";

const EventPage = () => {
  const { id } = useParams();
  const { data: event, isLoading } = useEventQuery(id!, {
    enabled: Boolean(id),
  });

  return (
    <Page>
      <EventPageContent event={event} isLoading={isLoading} />
    </Page>
  );
};

export { EventPage };

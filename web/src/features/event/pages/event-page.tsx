import { useParams } from "react-router-dom";
import { useEventQuery } from "../api";
import { Page } from "@components";
import { EventTab } from "../components";

const EventPage = () => {
  const { id } = useParams();
  const { data: event } = useEventQuery(id!, {
    enabled: Boolean(id),
  });

  return (
    <Page>
      <EventTab event={event} />
    </Page>
  );
};

export { EventPage };

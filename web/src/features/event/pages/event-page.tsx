import { useParams } from "react-router-dom";
import { useEventQuery } from "../api";
import { Page } from "@components";
import { ChangeEventStatusDialog, EventPageContent } from "../components";
import { useAuth } from "@features/auth";

const EventPage = () => {
  const { id } = useParams();
  const { data: event, isLoading } = useEventQuery(id!, {
    enabled: Boolean(id),
  });
  const { isPermitted } = useAuth();

  return (
    <Page
      title={event?.name}
      breadcrumbs={[{ label: `Wydarzenie: ${event?.name}`, isActive: true }]}
      {...(isPermitted &&
        event && {
          headerContent: <ChangeEventStatusDialog event={event} />,
        })}
    >
      <EventPageContent event={event} isLoading={isLoading} />
    </Page>
  );
};

export { EventPage };

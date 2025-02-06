import { useEventQuery } from "../api";
import { Page } from "@components";
import { ChangeEventStatusDialog, EventPageContent } from "../components";
import { useAuth } from "@features/auth";
import { useParams } from "next/navigation";

const EventPage = () => {
  const { id } = useParams();
  const { data: event, isLoading } = useEventQuery(id as string, {
    enabled: Boolean(id),
  });
  const { isPermitted } = useAuth();

  return (
    <Page
      title={event?.name}
      breadcrumbs={[
        {
          label: `Wydarzenie: ${event?.name}`,
          isActive: true,
          isLoading,
        },
      ]}
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

import { useEventQuery } from "../api";
import { Metadata, Page } from "@components";
import { ChangeEventStatusDialog, EventPageContent } from "../components";
import { useAuth } from "@features/auth";
import { useRouter } from "next/router";

const EventPage = () => {
  const {
    query: { id },
  } = useRouter();

  const { data: event, isLoading } = useEventQuery(id as string, {
    enabled: Boolean(id),
  });
  const { isPermitted } = useAuth();

  return (
    <>
      <Metadata title={event?.name ?? ""} description={event?.description} />
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
    </>
  );
};

export { EventPage };

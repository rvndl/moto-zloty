import { Badge } from "@components/badge";
import { Value } from "@components/value";
import { type EventStatus } from "@features/event/types";

const statusToVariant = (status: EventStatus | null) => {
  switch (status) {
    case "pending":
      return "warning";
    case "approved":
      return "success";
    default:
      return "danger";
  }
};

const statusToText = (status: EventStatus | null) => {
  switch (status) {
    case "pending":
      return "W oczekiwaniu na zatwierdzenie";
    case "approved":
      return "Zatwierdzono";
    default:
      return "Odrzocono";
  }
};

interface Props {
  status: EventStatus | null;
  isLoading?: boolean;
}

const EventStatusBadge = ({ status }: Props) => {
  return (
    <Badge className="w-max" variant={statusToVariant(status)}>
      {statusToText(status)}
    </Badge>
  );
};

const EventStatus = ({ status, isLoading }: Props) => {
  return (
    <Value
      title="Status"
      {...(status === "pending" && {
        helpText: (
          <>
            Wydarzenie musi zostać zatwierdzone przez moderację, aby pojawiło
            się na stronie głównej. <br /> Możesz jednak udostępnić bezpośredni
            link do wydarzenia, dzięki czemu inni również będą mogli je
            zobaczyć.
          </>
        ),
      })}
      isLoading={isLoading}
    >
      <EventStatusBadge status={status} />
    </Value>
  );
};

export { EventStatus, EventStatusBadge };

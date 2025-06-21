import { Badge, Value } from "@components";
import { type EventStatus } from "types/event";

const statusToVariant = (status?: EventStatus) => {
  switch (status) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    default:
      return "danger";
  }
};

const statusToText = (status?: EventStatus) => {
  switch (status) {
    case "PENDING":
      return "W oczekiwaniu na zatwierdzenie";
    case "APPROVED":
      return "Zatwierdzono";
    default:
      return "Odrzocono";
  }
};

interface Props {
  status?: EventStatus;
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
      {...(status === "PENDING" && {
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

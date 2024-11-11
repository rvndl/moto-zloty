import { Badge, Value } from "@components";
import { type EventStatus } from "types/event";

interface Props {
  status?: EventStatus;
}

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

const EventStatus = ({ status }: Props) => {
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
    >
      <Badge className="w-max" variant={statusToVariant(status)}>
        {statusToText(status)}
      </Badge>
    </Value>
  );
};

export { EventStatus };

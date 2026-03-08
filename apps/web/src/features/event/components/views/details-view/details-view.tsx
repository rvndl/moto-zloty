import { Header } from "./header";
import { Details } from "./body/details";
import { type Event } from "@features/event/types";

interface Props {
  event?: Event;
}

const DetailsView = ({ event }: Props) => {
  return (
    <article>
      <Header event={event} />
      <div className="w-full flex justify-center">
        {event && <Details event={event} />}
      </div>
    </article>
  );
};

export { DetailsView };

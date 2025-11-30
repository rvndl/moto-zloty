import { Event } from "types/event";
import { Header } from "./header";
import { Details } from "./details/details";

interface Props {
  event: Event;
}

const DetailsPageContent = ({ event }: Props) => {
  return (
    <article>
      <Header event={event} />
      <div className="w-full flex justify-center">
        <Details event={event} />
      </div>
    </article>
  );
};

export { DetailsPageContent };

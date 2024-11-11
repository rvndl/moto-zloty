import { Value, Card, TextEditor, Dialog } from "@components";
import { getFilePath } from "@utils/index";
import { type Event } from "types/event";
import { EventStartingDate } from "../event-starting-date";
import { EventEndingDate } from "../event-ending-date";
import { EventStatus } from "../event-status";
import { PreviewMap } from "../preview-map";

interface Props {
  event?: Event;
  isLoading?: boolean;
}

const EventPageContent = ({ event, isLoading }: Props) => {
  return (
    <section className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
      <Card
        title="Szczegóły"
        description="Informacje o wydarzeniu"
        className="relative h-min"
      >
        <div className="absolute overflow-hidden top-5 right-5 w-28 h-28 rounded-xl">
          <Dialog
            title="Banner"
            description="Banner wydarzenia"
            trigger={
              <img
                src={getFilePath(event?.banner_id)}
                className="z-10 object-cover w-full h-full transition-transform border cursor-pointer rounded-xl hover:scale-105"
              />
            }
          >
            <img src={getFilePath(event?.banner_id)} />
          </Dialog>
        </div>
        <div className="flex flex-col gap-4">
          <Value title="Nazwa" isLoading={isLoading}>
            {event?.name}
          </Value>
          <Value title="Lokalizacja" isLoading={isLoading}>
            {event?.address}
          </Value>
          <EventStatus status={event?.status} isLoading={isLoading} />
          <div className="flex justify-between">
            <EventStartingDate event={event} isLoading={isLoading} />
            <EventEndingDate event={event} isLoading={isLoading} />
          </div>
          <TextEditor label="Opis" value={event?.description} isNonEditable />
        </div>
      </Card>
      <div className="w-full aspect-square">
        {event && (
          <PreviewMap
            className="w-full h-full"
            latitude={event?.latitude}
            longitude={event?.longitude}
          />
        )}
      </div>
    </section>
  );
};

export { EventPageContent };

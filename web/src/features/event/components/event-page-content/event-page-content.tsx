import { Value, Card, TextEditor, Dialog } from "@components";
import { getFilePath } from "@utils/index";
import { type Event } from "types/event";
import { EventStartingDate } from "../event-starting-date";
import { EventEndingDate } from "../event-ending-date";
import { EventStatus } from "../event-status";
import { PreviewMap } from "../preview-map";
import { ActionsList } from "./actions-list";

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
        <div className="absolute w-20 h-20 overflow-hidden top-5 right-5 md:w-28 md:h-28 rounded-xl">
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
      <div className="flex flex-col w-full gap-4 aspect-square">
        {event && (
          <PreviewMap
            className="w-full h-full"
            latitude={event?.latitude}
            longitude={event?.longitude}
            isLoading={isLoading}
          />
        )}
        <ActionsList />
      </div>
    </section>
  );
};

export { EventPageContent };

import { Value, Card, Button, MapPinnedIcon } from "@components";
import { type Event } from "types/event";
import { EventStartingDate } from "../event-starting-date";
import { EventEndingDate } from "../event-ending-date";
import { EventStatus } from "../event-status";
import { PreviewMap } from "../preview-map";
import { ActionsList } from "./actions-list";
import { BannerPreview } from "./banner-preview";
import dynamic from "next/dynamic";

interface Props {
  event?: Event;
  isLoading?: boolean;
}

const EventPageContent = ({ event, isLoading }: Props) => {
  const hasBanner = event?.banner_id || event?.banner_small_id;

  const TextEditor = dynamic(
    () => import("@components/text-editor").then((mod) => mod.TextEditor),
    {
      ssr: false,
    }
  );

  return (
    <section className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
      <Card
        title="Szczegóły"
        description="Informacje o wydarzeniu"
        className="relative h-min"
      >
        {hasBanner && <BannerPreview event={event} />}
        <div className="flex flex-col gap-4">
          <Value title="Nazwa" isLoading={isLoading}>
            {event?.name}
          </Value>
          <Value title="Lokalizacja" isLoading={isLoading}>
            <div className="flex items-center gap-2">
              <p>{event?.address}</p>
              <a
                href={`https://maps.google.com/?q=${event?.latitude},${event?.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="small"
                  variant="outline"
                  className="p-1 scale-75 text-muted"
                >
                  <MapPinnedIcon />
                </Button>
              </a>
            </div>
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
            latitude={event.latitude}
            longitude={event.longitude}
            isLoading={isLoading}
          />
        )}
        <ActionsList />
      </div>
    </section>
  );
};

export { EventPageContent };

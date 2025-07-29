import { type Event } from "types/event";
import { EventStartingDate } from "../event-starting-date";
import { EventEndingDate } from "../event-ending-date";
import { EventStatus } from "../event-status";
import { PreviewMap } from "../preview-map";
import { ActionList } from "./action-list";
import { BannerPreview } from "./banner-preview";
import dynamic from "next/dynamic";
import { MapPinnedIcon } from "lucide-react";
import { makeAddressString } from "@features/event/utils";
import { Card } from "@components/card";
import { Value } from "@components/value";
import { Button } from "@components/button";
import { Tooltip } from "@components/tooltip";

interface Props {
  event?: Event;
  isLoading?: boolean;
}

const Details = ({ event, isLoading }: Props) => {
  const hasBanner = event?.banner_id || event?.banner_small_id;

  const TextEditor = dynamic(
    () =>
      import("@components/text-editor/text-editor").then(
        (mod) => mod.TextEditor,
      ),
    {
      ssr: false,
    },
  );

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <div className="flex flex-wrap items-center w-full gap-2 shrink-0">
              <p>{makeAddressString(event?.full_address)}</p>
              <a
                href={`https://maps.google.com/?q=${event?.latitude},${event?.longitude}`}
                target="_blank"
                rel="noreferrer"
                data-tooltip-id="map-icon-tooltip"
                data-tooltip-content="Otwórz w mapach Google"
              >
                <Button
                  size="small"
                  variant="outline"
                  className="p-1 scale-75 text-muted shrink-0"
                >
                  <MapPinnedIcon className="shrink-0" />
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
        <ActionList />
      </div>
      <Tooltip id="map-icon-tooltip" />
    </section>
  );
};

export { Details };

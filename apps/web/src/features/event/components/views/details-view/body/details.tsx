import { type Event } from "@features/event/types";
import {
  getMonthNumberFromDateStr,
  makeAddressString,
} from "@features/event/utils";
import { Card } from "@components/card";
import { ActionList } from "./action-list";
import { RelatedEvents } from "./related-events";
import TextEditorPreview from "@components/text-editor/text-editor-preview";
import { PreviewMap } from "../../../shared/preview-map";
import { MapPinIcon } from "lucide-react";

interface Props {
  event: Event;
  isLoading?: boolean;
}

const Details = ({ event, isLoading }: Props) => {
  const monthNum = getMonthNumberFromDateStr(event.dateFrom);

  return (
    <section className="gap-4 max-w-7xl grid-cols-12 sm:px-6 lg:px-8 grid center content-center w-full mt-12">
      <div className="col-span-12 md:col-span-8 gap-4 grid">
        <Card
          title="Opis wydarzenia"
          titleAs="h2"
          description={event.name}
          className="h-min"
        >
          <TextEditorPreview value={event.description ?? undefined} />
        </Card>
        <Card
          title="Lokalizacja wydarzenia"
          titleAs="h2"
          description={
            <span className="flex items-center gap-1">
              <MapPinIcon size="18px" />{" "}
              <a
                href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {makeAddressString(event.fullAddress)}
              </a>
            </span>
          }
          contentClassName="w-full aspect-square"
        >
          {event && (
            <PreviewMap
              className="w-full h-full"
              latitude={event.latitude}
              longitude={event.longitude}
              isLoading={isLoading}
            />
          )}
        </Card>
      </div>

      <div className="grid gap-4 col-span-12 md:col-span-4 h-min">
        {event && (
          <RelatedEvents
            eventId={event.id}
            monthNum={monthNum}
            state={event.fullAddress?.state ?? ""}
          />
        )}
        <ActionList />
      </div>
      {/*<Card
        title="Szczegóły"
        description="Informacje o wydarzeniu."
        className="relative h-min"
      >
        {hasBanner && <BannerPreview event={event} />}
        <div className="flex flex-col gap-4">
          <Value title="Nazwa" isLoading={isLoading}>
            {event.name}
          </Value>

          <EventStatus status={event.status} isLoading={isLoading} />
          <div className="flex justify-between">
            <EventStartingDate event={event} isLoading={isLoading} />
            <EventEndingDate event={event} isLoading={isLoading} />
          </div>
          <TextEditorPreview label="Opis" value={event.description} />
        </div>
      </Card>
      <aside className="flex flex-col w-full gap-4 aspect-square">
        <div className=" bg-white border rounded-xl shadow-sm w-full h-full aspect-square flex flex-col gap-4 ">
          <Value title="Lokalizacja" className="mt-4 mx-4">
            <Location event={event} />
          </Value>
          {event && (
            <PreviewMap
              className="w-full h-full"
              latitude={event.latitude}
              longitude={event.longitude}
              isLoading={isLoading}
            />
          )}
        </div>
        <div className="grid gap-4">
          {event && (
            <RelatedEvents
              eventId={event.id}
              monthNum={monthNum}
              state={event.fullAddress?.state ?? ""}
            />
          )}
          <ActionList />
        </div>
      </aside>
      <Tooltip id="map-icon-tooltip" />*/}
    </section>
  );
};

export { Details };

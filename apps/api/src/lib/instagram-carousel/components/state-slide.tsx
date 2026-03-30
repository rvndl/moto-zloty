/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import { Event } from "./event";
import { SlideShell } from "./slide-shell";
import type { StateSlideEventPreview } from "../types";

interface Props {
  title: string;
  logoSrc: string;
  tileSrc: string;
  events: StateSlideEventPreview[];
  extraCount: number;
}

export const StateSlide = ({
  title,
  logoSrc,
  tileSrc,
  events,
  extraCount,
}: Props) => {
  return (
    <SlideShell title={title} logoSrc={logoSrc} tileSrc={tileSrc}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
          padding: "28px",
          borderRadius: 30,
          background: "#ffffff05",
          border: "1px solid #ffffff10",
        }}
      >
        {events.map((event) => (
          <Event
            name={event.name}
            url={event.url}
            dateFrom={event.dateFrom}
            dateTo={event.dateTo}
            location={event.location}
          />
        ))}

        {extraCount > 0 ? (
          <div
            style={{
              display: "flex",
              paddingTop: 4,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 24,
                color: "#f97316",
                fontWeight: 700,
              }}
            >
              +{extraCount} kolejnych wydarzeń w tym województwie
            </p>
          </div>
        ) : null}
      </div>
    </SlideShell>
  );
};

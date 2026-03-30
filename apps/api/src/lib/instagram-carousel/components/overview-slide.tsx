/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import {
  formatInstagramCarouselDateLong,
  splitCarouselSummary,
} from "../../../utils";
import type { OverviewSlideInput } from "../types";
import { SlideShell } from "./slide-shell";
import { StatCard } from "./stat-card";
import { TopStateCard } from "./top-state-card";

interface Props {
  input: OverviewSlideInput;
  logoSrc: string;
  tileSrc: string;
}

export const OverviewSlide = ({ input, logoSrc, tileSrc }: Props) => {
  const summaryParagraphs = splitCarouselSummary(input.summary, 2);

  return (
    <SlideShell
      title={input.weekLabel}
      logoSrc={logoSrc}
      tileSrc={tileSrc}
      gap={28}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ margin: 0, fontSize: 28, opacity: 0.75 }}>
          {formatInstagramCarouselDateLong(input.weekStart)} -{" "}
          {formatInstagramCarouselDateLong(input.weekEnd)}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          paddingTop: "18px",
          maxWidth: 900,
        }}
      >
        {summaryParagraphs.map((paragraph) => (
          <p
            style={{
              margin: 0,
              fontSize: 58,
              lineHeight: 1.12,
              fontWeight: 700,
              color: "#f8fafc",
              letterSpacing: -1.6,
            }}
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <StatCard label="Wydarzenia" value={input.eventCount} />
        <StatCard label="Województwa" value={input.stateCount} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "28px",
          borderRadius: 28,
          background: "#ffffff05",
          border: "1px solid #ffffff10",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          Gdzie warto patrzeć najpierw
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {input.topStates.map((entry) => (
            <TopStateCard state={entry.state} count={entry.count} />
          ))}
        </div>
      </div>
    </SlideShell>
  );
};

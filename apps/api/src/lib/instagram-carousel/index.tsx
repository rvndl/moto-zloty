/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

import satori from "satori";
import sharp from "sharp";
import type { PublishWeeklyEventsBodyType } from "../../models/instagram-carousel";
import {
  formatInstagramCarouselDate,
  formatInstagramCarouselDateLong,
  truncateCarouselText,
} from "../../utils";
import {
  INSTAGRAM_HEIGHT,
  INSTAGRAM_WIDTH,
  loadCarouselAssets,
} from "./assets";
import { OverviewSlide } from "./components/overview-slide";
import { StateSlide } from "./components/state-slide";
import { prepareEventImageDataUrl } from "./images";
import type {
  InstagramCarouselInput,
  OverviewSlideInput,
  StateGroup,
  StateSlideInput,
} from "./types";

export { formatInstagramCarouselDateLong as formatDateLong } from "../../utils";
export type { StateGroup } from "./types";

export class InstagramCarousel {
  public async generateSvg(input: InstagramCarouselInput) {
    const { fonts, logoSrc, tileSrc } = await loadCarouselAssets();

    const svg = await satori(
      input.kind === "overview"
        ? this.renderOverview(input, logoSrc, tileSrc)
        : await this.renderState(input, logoSrc, tileSrc),
      {
        width: INSTAGRAM_WIDTH,
        height: INSTAGRAM_HEIGHT,
        fonts,
      },
    );

    return svg;
  }

  public async generatePng(input: InstagramCarouselInput) {
    const svg = await this.generateSvg(input);
    return sharp(Buffer.from(svg)).png().toBuffer();
  }

  private renderOverview(
    input: OverviewSlideInput,
    logoSrc: string,
    tileSrc: string,
  ) {
    return <OverviewSlide input={input} logoSrc={logoSrc} tileSrc={tileSrc} />;
  }

  private async renderState(
    input: StateSlideInput,
    logoSrc: string,
    tileSrc: string,
  ) {
    const visibleEvents = input.events.slice(0, 6);
    const extraCount = Math.max(0, input.events.length - visibleEvents.length);
    const events = await Promise.all(
      visibleEvents.map(async (event) => ({
        name: truncateCarouselText(event.name, 64),
        url: await prepareEventImageDataUrl(event.imageUrl),
        dateFrom: formatInstagramCarouselDate(event.date),
        dateTo: formatInstagramCarouselDate(event.date),
        location: truncateCarouselText(event.location, 46),
      })),
    );

    return (
      <StateSlide
        title={input.state}
        logoSrc={logoSrc}
        tileSrc={tileSrc}
        events={events}
        extraCount={extraCount}
      />
    );
  }
}

export const renderOverviewSlide = async (
  payload: PublishWeeklyEventsBodyType,
  stateGroups: StateGroup[],
  summary: string,
) => {
  const carousel = new InstagramCarousel();

  return carousel.generatePng({
    kind: "overview",
    weekLabel: payload.weekLabel,
    weekStart: payload.weekStart,
    weekEnd: payload.weekEnd,
    summary,
    eventCount: payload.events.length,
    stateCount: stateGroups.length,
    topStates: stateGroups.slice(0, 6).map((group) => ({
      state: group.state,
      count: group.events.length,
    })),
  });
};

export const renderStateSlide = async (stateGroup: StateGroup) => {
  const carousel = new InstagramCarousel();

  return carousel.generatePng({
    kind: "state",
    state: stateGroup.state,
    events: stateGroup.events,
  });
};

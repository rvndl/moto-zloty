import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import type {
  PublishWeeklyEventsBodyType,
  PublishWeeklyEventsSlideType,
  WeeklyMotorcycleEventType,
} from "../models/instagram-carousel";
import {
  type StateGroup,
  formatDateLong,
  renderOverviewSlide,
  renderStateSlide,
} from "../lib/instagram-carousel";
import {
  dedupeItems,
  normalizeInstagramCarouselStateName,
  resolveInstagramCarouselOverviewEventLabel,
  slugify,
  toInstagramCarouselHashtag,
  toInstagramCarouselStateLocative,
} from "../utils";
import { AIService } from "./ai";
import { FileService } from "./file";
import { err, ok, type ServiceResult } from "./types";

const TEMP_UPLOAD_SUBDIR = "instagram-carousel";
const DEFAULT_HASHTAGS = [
  "#MotocyklePolska",
  "#MotoZloty",
  "#ZlotMotocyklowy",
  "#SezonMotocyklowy",
  "#Motocykliści",
  "#PolskaNaMotocyklu",
];
const STATE_TAG_LIMIT = 8;
const EVENT_TAG_LIMIT = 6;

const EVENT_TYPE_TAGS: Array<{ pattern: RegExp; tag: string }> = [
  { pattern: /zlot/i, tag: "#ZlotMotocyklowy" },
  { pattern: /rajd/i, tag: "#RajdMotocyklowy" },
  { pattern: /piknik/i, tag: "#PiknikMotocyklowy" },
  { pattern: /parad/i, tag: "#ParadaMotocyklowa" },
  {
    pattern: /otwarcie|rozpocz[eę]cie sezonu/i,
    tag: "#RozpoczecieSezonu",
  },
  {
    pattern: /zako[nń]czenie sezonu/i,
    tag: "#ZakonczenieSezonu",
  },
  { pattern: /charytatyw/i, tag: "#MotocyklePomagaja" },
  { pattern: /festiwal/i, tag: "#MotoFestiwal" },
];

interface GeneratedSlide {
  kind: "overview" | "state";
  title: string;
  state?: string;
  buffer: Buffer;
  fileName: string;
}

const convertSlideBufferToInstagramPhoto = async (buffer: Buffer) =>
  sharp(buffer).flatten({ background: "#000000" }).jpeg({ quality: 92 }).toBuffer();

const toInstagramPhotoFileName = (fileName: string) =>
  fileName.replace(/\.[^.]+$/, ".jpg");

export interface UploadedGeneratedSlide extends PublishWeeklyEventsSlideType {
  buffer: Buffer;
}

const inferEventTags = (events: WeeklyMotorcycleEventType[]) => {
  const tags = events.flatMap((event) => {
    const source = `${event.name} ${event.eventType ?? ""}`;

    return EVENT_TYPE_TAGS.filter(({ pattern }) => pattern.test(source)).map(
      ({ tag }) => tag,
    );
  });

  return dedupeItems(tags).slice(0, EVENT_TAG_LIMIT);
};

export const buildInstagramCarouselHashtags = (
  events: WeeklyMotorcycleEventType[],
  states: string[],
) => {
  const stateTags = dedupeItems(states)
    .map((state) => toInstagramCarouselHashtag(state))
    .filter(Boolean)
    .slice(0, STATE_TAG_LIMIT);

  return dedupeItems([
    ...DEFAULT_HASHTAGS,
    ...inferEventTags(events),
    ...stateTags,
  ]);
};

export const groupInstagramCarouselEventsByState = (
  events: WeeklyMotorcycleEventType[],
) => {
  const groups = events.reduce<Map<string, WeeklyMotorcycleEventType[]>>(
    (acc, event) => {
      const state = normalizeInstagramCarouselStateName(
        event.state || "Cała Polska",
      );
      const stateEvents = acc.get(state) ?? [];

      stateEvents.push(event);
      acc.set(state, stateEvents);
      return acc;
    },
    new Map(),
  );

  return Array.from(groups.entries())
    .map<StateGroup>(([state, stateEvents]) => ({
      state,
      events: [...stateEvents].sort(
        (left, right) =>
          new Date(left.date).getTime() - new Date(right.date).getTime(),
      ),
    }))
    .sort(
      (left, right) =>
        right.events.length - left.events.length ||
        left.state.localeCompare(right.state, "pl"),
    );
};

export const buildInstagramCarouselCaption = (
  payload: PublishWeeklyEventsBodyType,
  stateGroups: StateGroup[],
  hashtags: string[],
) => {
  const statePreview = stateGroups
    .slice(0, 4)
    .map((group) => group.state)
    .join(", ");
  const extraStates =
    stateGroups.length > 4
      ? ` i ${stateGroups.length - 4} kolejnych województw`
      : "";

  const intro = `Nadchodzi motocyklowy tydzień ${payload.weekLabel} — na trasie czekają ${payload.events.length} wydarzenia w ${stateGroups.length} województwach Polski.`;
  const body = `W karuzeli znajdziesz szybki przegląd regionów oraz najbliższe zloty, rajdy i spotkania m.in. w ${statePreview}${extraStates}. Zapisz post, oznacz ekipę i planuj trasę na ${formatDateLong(payload.weekStart)} – ${formatDateLong(payload.weekEnd)}.`;

  return `${intro}\n\n${body}\n\n${hashtags.join(" ")}`.trim();
};

const buildFallbackOverviewSummary = (
  payload: PublishWeeklyEventsBodyType,
  stateGroups: StateGroup[],
) => {
  const [primaryState] = stateGroups;
  const eventLabel = resolveInstagramCarouselOverviewEventLabel(
    payload.events.map((event) => event.eventType),
  );
  const primaryStateLabel = primaryState
    ? toInstagramCarouselStateLocative(primaryState.state)
    : "całej Polsce";

  return [
    `Siema, co tam — w tym tygodniu wpadają ${payload.events.length} moto wydarzenia w ${stateGroups.length} województwach.`,
    `Najwięcej dzieje się w ${primaryStateLabel}, ale ogólnie w całej Polsce coś się kręci. Jak planujecie jakieś ${eventLabel}, to pewnie gdzieś się miniemy na trasie.`,
  ].join(" ");
};

const resolveOverviewSummary = async (
  payload: PublishWeeklyEventsBodyType,
  stateGroups: StateGroup[],
) => {
  const summaryResult = await AIService.generateInstagramWeeklySummary({
    weekLabel: payload.weekLabel,
    weekStart: payload.weekStart,
    weekEnd: payload.weekEnd,
    events: payload.events,
  });

  if (summaryResult.success) {
    return summaryResult.data;
  }

  console.warn(
    "Falling back to deterministic Instagram overview summary:",
    summaryResult.error,
  );

  return buildFallbackOverviewSummary(payload, stateGroups);
};

export const resolveInstagramCarouselPublicBaseUrl = (override?: string) => {
  if (override) {
    return override.replace(/\/$/, "");
  }

  if (Bun.env.PUBLIC_API_URL) {
    return Bun.env.PUBLIC_API_URL.replace(/\/$/, "");
  }

  if (Bun.env.APP_URL) {
    return Bun.env.APP_URL.replace(/\/$/, "");
  }

  return `http://localhost:${Bun.env.PORT ?? "3000"}`;
};

export const uploadInstagramCarouselSlide = async (
  slide: GeneratedSlide,
  publicBaseUrl: string,
): Promise<ServiceResult<UploadedGeneratedSlide>> => {
  try {
    const uploadRoot = Bun.env.UPLOAD_PATH || Bun.env.UPLOAD_DIR || "./uploads";
    const targetDirectory = join(uploadRoot, TEMP_UPLOAD_SUBDIR);
    await mkdir(targetDirectory, { recursive: true });

    const instagramBuffer = await convertSlideBufferToInstagramPhoto(
      slide.buffer,
    );
    const fileName = `${crypto.randomUUID()}-${toInstagramPhotoFileName(slide.fileName)}`;
    const filePath = join(targetDirectory, fileName);

    await Bun.write(filePath, instagramBuffer);

    const fileRecord = await FileService.createFromPath(filePath, "temporary");
    if (!fileRecord.success) {
      return fileRecord as ServiceResult<UploadedGeneratedSlide>;
    }

    return ok({
      kind: slide.kind,
      title: slide.title,
      state: slide.state,
      fileId: fileRecord.data.id,
      publicUrl: `${publicBaseUrl}/file/${fileRecord.data.id}`,
      buffer: instagramBuffer,
    });
  } catch (error) {
    console.error("Failed to upload generated slide:", error);
    return err(500, "Nie udało się przygotować publicznego URL-a dla slajdu.");
  }
};

export const generateInstagramCarouselSlides = async (
  payload: PublishWeeklyEventsBodyType,
  stateGroups: StateGroup[],
) => {
  const overviewSummary = await resolveOverviewSummary(payload, stateGroups);
  const overviewBuffer = await renderOverviewSlide(
    payload,
    stateGroups,
    overviewSummary,
  );

  const stateSlides = await Promise.all(
    stateGroups.map(async (stateGroup) => ({
      kind: "state" as const,
      title: stateGroup.state,
      state: stateGroup.state,
      buffer: await renderStateSlide(stateGroup),
      fileName: `${slugify(stateGroup.state)}.png`,
    })),
  );

  return [
    {
      kind: "overview" as const,
      title: payload.weekLabel,
      buffer: overviewBuffer,
      fileName: `overview-${slugify(payload.weekLabel)}.png`,
    },
    ...stateSlides,
  ] satisfies GeneratedSlide[];
};

export const resolveInstagramGraphCredentials = (
  payload: PublishWeeklyEventsBodyType,
) => {
  const instagramAccountId =
    payload.instagramAccountId ?? Bun.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken =
    payload.accessToken ?? Bun.env.FACEBOOK_GRAPH_ACCESS_TOKEN;

  if (!instagramAccountId || !accessToken) {
    return null;
  }

  return {
    instagramAccountId,
    accessToken,
  };
};

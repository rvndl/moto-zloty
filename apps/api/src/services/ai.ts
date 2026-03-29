import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { type ServiceResult, ok, err } from "./types";
import { FileService } from "./file";
import { EventService } from "./event";
import type {
  BannerScrapResponse,
  FacebookPostBody,
  FacebookPostResponse,
} from "../models/ai";
import {
  formatFacebookPostDate,
  formatFacebookPostState,
  getRelevantEventLocation,
} from "../utils";

type BannerScrapResult = typeof BannerScrapResponse.static;
type FacebookPostWeekInput = (typeof FacebookPostBody.static.weeks)[number];
type FacebookPostResult = typeof FacebookPostResponse.static;

interface FacebookPostEventSummary {
  id: string;
  name: string;
  dateFrom: string | Date;
  state: string;
  location: string;
}

const PROMPT = `
You are an expert SEO copywriter and data extraction specialist. The current year is 2026.
Your task is to analyze the provided image(s) of a motorcycle rally (zlot motocyklowy) and any accompanying text, extract the data, and generate a highly SEO-optimized output.

Extract the following information:
- name: Event name (normalize capitalization, do not use ALL CAPS). ALWAYS append " - 2026" at the end of the extracted name (e.g., "II Zlot Motocyklowy CLI Riders - 2026").
- dateFrom: Formatted as ISO 8601 datetime. Include time if mentioned. If no time is specified, assume 00:00:00.
- dateTo: Formatted as ISO 8601 datetime. Include time if mentioned. If no time is specified, assume 23:59:59.
- location: The most precise location available (city, venue, street, region). Search thoroughly in both image and text.

- description: Create a comprehensive, SEO-friendly event description based on the extracted data. 
  Follow these STRICT rules for the description:
  1. LANGUAGE: Polish ONLY.
  2. FORMATTING: Use Markdown. DO NOT use H1 (#) headings. Use H2 (##) for main sections and H3 (###) for subsections. Use bullet points for lists, and bold (**) key entities (e.g., bands, important hours, locations, ticket prices). Fix all ALL CAPS text into proper sentence case.
  3. CLEANUP: Remove UI artifacts like "Pokaż mniej", "Pokaż więcej", "Read more", or links. Correct obvious typos but preserve factual accuracy.
  4. SEO & CONTENT EXPANSION:
     - Lead Paragraph (Hook): Write an engaging, 2-3 sentence introduction. It MUST contain the event name, location, date, and primary keywords (e.g., "zlot motocyklowy", "impreza motocyklowa", "sezon 2026", "motocykliści"). 
     - Structure: Do not just paste a wall of text. Group the extracted information logically into SEO-friendly sections using H2 (##) headings, such as: "## Co czeka na uczestników?", "## Program zlotu", "## Informacje organizacyjne i lokalizacja".
     - Keywords Enrichment: Naturally integrate semantic keywords relevant to motorcycle events (e.g., parada motocyklowa, koncerty rockowe, pole namiotowe, blachy, integracja, pole zlotowe, trasa).
     - Elaboration: Expand on the provided details in an enthusiastic, welcoming tone typical for the motorcycle community. If the source mentions "koncerty", format it as a nice list.
  5. CTA: End the description with a short, encouraging sentence to participate, share with friends, or prepare machines for the trip.
`;

const FACEBOOK_DESCRIPTION_PROMPT = `
You are a Polish social media copywriter for a motorcycle events website. The current year is 2026.
Create ONLY a very short Facebook intro in Polish for an upcoming-events post.

Rules:
- Return plain text only.
- 2 or 3 short sentences maximum.
- Sound energetic, friendly and relevant for motorcycle enthusiasts.
- Mention that these are upcoming motorcycle rallies / events in Poland.
- Add 2-4 fitting emojis to catch attention.
- Do not add hashtags.
- Do not list events.
- Do not add quotation marks.
`;

const aiResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "Event name",
      nullable: true,
    },
    description: {
      type: Type.STRING,
      description:
        "Event description in markdown format, properly capitalized, SEO friendly. No h1 headings — use h2 as the highest level.",
      nullable: true,
    },
    dateFrom: {
      type: Type.STRING,
      description: "Start date in ISO 8601 datetime format",
      nullable: true,
    },
    dateTo: {
      type: Type.STRING,
      description: "End date in ISO 8601 datetime format",
      nullable: true,
    },
    location: {
      type: Type.STRING,
      description: "Event location",
      nullable: true,
    },
  },
  required: ["name", "description", "dateFrom", "dateTo", "location"],
};

const ai = new GoogleGenAI({ apiKey: Bun.env.GOOGLE_AI_API_KEY });

const buildFacebookPostContent = (
  description: string,
  events: FacebookPostEventSummary[],
) => {
  const groupedByState = Object.values(
    events.reduce<Record<string, FacebookPostEventSummary[]>>((acc, event) => {
      const state = event.state;

      if (!acc[state]) {
        acc[state] = [];
      }

      acc[state].push(event);
      return acc;
    }, {}),
  );

  const eventSections = groupedByState.flatMap((stateEvents) => {
    const [firstEvent] = stateEvents;

    if (!firstEvent) {
      return [];
    }

    return [
      `- 📍 ${firstEvent.state}`,
      ...stateEvents.map(
        (event) =>
          `- 🗓️ ${formatFacebookPostDate(event.dateFrom)} ${event.location} ${event.name} https://moto-zloty.pl/wydarzenie/${event.id}`,
      ),
    ];
  });

  return [description.trim(), ...eventSections]
    .filter(Boolean)
    .join("\n\n")
    .trim();
};

export abstract class AIService {
  static async bannerScrap(
    fileId: string,
    additionalInfo?: string,
  ): Promise<ServiceResult<BannerScrapResult>> {
    const fileResult = await FileService.getById(fileId);
    if (!fileResult.success) {
      return err(
        404,
        "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie.",
      );
    }

    const bunFile = Bun.file(fileResult.data.path);
    if (!(await bunFile.exists())) {
      return err(
        404,
        "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie.",
      );
    }

    const fileContent = await bunFile.arrayBuffer();
    const base64Data = Buffer.from(fileContent).toString("base64");

    try {
      const prompt = additionalInfo
        ? `${PROMPT}\n\nAdditional context: ${additionalInfo}`
        : PROMPT;

      const res = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: [
          { inlineData: { mimeType: "image/webp", data: base64Data } },
          { text: prompt },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: aiResponseSchema,
        },
      });

      const text = res.text;
      if (!text) {
        return err(
          500,
          "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie.",
        );
      }

      return ok(JSON.parse(text) as BannerScrapResult);
    } catch (error) {
      console.error("Failed to process banner:", error);
      return err(
        500,
        "Wystąpił błąd podczas generowania danych na podstawie plakatu. Spróbuj ponownie.",
      );
    }
  }

  static async generateFacebookPost(
    weeks: FacebookPostWeekInput[],
  ): Promise<ServiceResult<FacebookPostResult>> {
    if (!weeks.length) {
      return err(400, "Wybierz co najmniej jeden tydzień.");
    }

    const weekResults = await Promise.all(
      weeks.map(async (week) => {
        const startYear = new Date(week.start).getFullYear();
        const endYear = new Date(week.end).getFullYear();

        const [startYearEvents, endYearEvents] = await Promise.all([
          EventService.list({
            dateFrom: week.start,
            dateTo: week.end,
            sortOrder: "Asc",
            year: String(startYear),
          }),
          startYear === endYear
            ? Promise.resolve([])
            : EventService.list({
                dateFrom: week.start,
                dateTo: week.end,
                sortOrder: "Asc",
                year: String(endYear),
              }),
        ]);

        const events = [...startYearEvents, ...endYearEvents];

        return { week, events };
      }),
    );

    const events = Array.from(
      new Map(
        weekResults
          .flatMap((result) => result.events)
          .map((event) => [event.id, event]),
      ).values(),
    ).sort(
      (eventA, eventB) =>
        new Date(eventA.dateFrom).getTime() -
        new Date(eventB.dateFrom).getTime(),
    );

    if (!events.length) {
      return err(404, "Brak nadchodzących wydarzeń dla wybranych tygodni.");
    }

    const normalizedEvents: FacebookPostEventSummary[] = events.map(
      (event) => ({
        id: event.id,
        name: event.name,
        dateFrom: event.dateFrom,
        state: formatFacebookPostState(event.fullAddress?.state),
        location: getRelevantEventLocation(event),
      }),
    );

    const weeksLabel = weeks.map((week) => week.label).join(", ");
    const statesLabel = Array.from(
      new Set(normalizedEvents.map((event) => event.state)),
    ).join(", ");

    try {
      const res = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: [
          {
            text: `${FACEBOOK_DESCRIPTION_PROMPT}\n\nSelected weeks: ${weeksLabel}\nStates: ${statesLabel}\nEvents count: ${normalizedEvents.length}\nEvents:\n${normalizedEvents
              .map(
                (event) =>
                  `- ${formatFacebookPostDate(event.dateFrom)}, ${event.state}, ${event.location}, ${event.name}`,
              )
              .join("\n")}`,
          },
        ],
      });

      const description = res.text?.trim();

      if (!description) {
        return err(500, "Nie udało się wygenerować treści posta na Facebooka.");
      }

      return ok({
        description,
        content: buildFacebookPostContent(description, normalizedEvents),
        eventCount: normalizedEvents.length,
      });
    } catch (error) {
      console.error("Failed to generate Facebook post:", error);
      return err(500, "Nie udało się wygenerować treści posta na Facebooka.");
    }
  }
}

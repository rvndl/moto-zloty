import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { type ServiceResult, ok, err } from "./types";
import { FileService } from "./file";
import type { BannerScrapResponse } from "../models/ai";

type BannerScrapResult = typeof BannerScrapResponse.static;

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
}

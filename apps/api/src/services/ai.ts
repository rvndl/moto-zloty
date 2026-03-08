import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { type ServiceResult, ok, err } from "./types";
import { FileService } from "./file";
import type { BannerScrapResponse } from "../models/ai";

type BannerScrapResult = typeof BannerScrapResponse.static;

const PROMPT = `
    1. The current year is 2026
    Extract the following information from the image:
        - name: Event name
        - description: preserve original formatting and capitalization. Do not use all uppercase, should be nicely capitalized, make sure it's nicely formatted, use dashes, bullet points, etc. Make the description SEO friendly. Use markdown formatting! Do NOT use h1 (#) headings in the description — only use h2 (##) and smaller headings.
        - dateFrom: formatted as ISO 8601 datetime. If the description contains time, include it in the datetime. If the starting date doesn't contain a time, assume it starts at 00:00:00.
        - dateT o: formatted as ISO 8601 datetime. Include the time if mentioned in the description. If the ending date doesn't contain a time, assume it ends at 23:59:59.
        - location: more precise location can also be included in description, look for it.

    Additional instructions:
        Keep the original language. Do not translate.
        Do not add any extra information.
        Remove "Pokaż mniej" or "Pokaż więcej" from the description if present.
        Make the description nicely readable and formatted, but do not change the original meaning, it should be capitalized, NOT uppercase, separate the text using new lines, add dashes, bullet points, etc., make it SEO friendly.
        Do NOT use h1 (#) headings in the description. Use h2 (##) as the highest heading level. The event name is already displayed separately as h1, so the description should start from h2 onwards.
        The description should be POLISH only!
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
        model: "gemini-3-flash-preview",
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

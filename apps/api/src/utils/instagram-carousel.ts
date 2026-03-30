const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Warsaw",
});

const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Warsaw",
});

const POLISH_DIACRITICS_MAP: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ż: "z",
  ź: "z",
  Ą: "A",
  Ć: "C",
  Ę: "E",
  Ł: "L",
  Ń: "N",
  Ó: "O",
  Ś: "S",
  Ż: "Z",
  Ź: "Z",
};

const STATE_LOCATIVE_MAP: Record<string, string> = {
  Dolnośląskie: "Dolnym Śląsku",
  "Kujawsko-pomorskie": "Kujawsko-Pomorskiem",
  Lubelskie: "Lubelskiem",
  Lubuskie: "Lubuskiem",
  Łódzkie: "Łódzkiem",
  Małopolskie: "Małopolsce",
  Mazowieckie: "Mazowszu",
  Opolskie: "Opolskiem",
  Podkarpackie: "Podkarpaciu",
  Podlaskie: "Podlasiu",
  Pomorskie: "Pomorskiem",
  Śląskie: "Śląsku",
  Świętokrzyskie: "Świętokrzyskiem",
  "Warmińsko-mazurskie": "Warmińsko-Mazurskiem",
  Wielkopolskie: "Wielkopolsce",
  Zachodniopomorskie: "Zachodniopomorskiem",
  "Cała Polska": "całej Polsce",
};

export const stripDiacritics = (value: string) =>
  Array.from(value)
    .map((character) => POLISH_DIACRITICS_MAP[character] ?? character)
    .join("");

export const formatInstagramCarouselDate = (value: string) =>
  SHORT_DATE_FORMATTER.format(new Date(value));

export const formatInstagramCarouselDateLong = (value: string) =>
  LONG_DATE_FORMATTER.format(new Date(value));

export const truncateCarouselText = (value: string, maxLength: number) =>
  value.length <= maxLength
    ? value
    : `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;

export const slugify = (value: string) =>
  stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();

export const normalizeInstagramCarouselStateName = (state: string) =>
  state
    .replace(/^wojew[oó]dztwo\s+/i, "")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();

export const toInstagramCarouselHashtag = (value: string) => {
  const normalized = stripDiacritics(value)
    .replace(/^wojewodztwo\s+/i, "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  return normalized ? `#${normalized}` : "";
};

export const toInstagramCarouselStateLocative = (state: string) =>
  STATE_LOCATIVE_MAP[state] ?? state;

export const dedupeItems = <T>(items: T[]) => Array.from(new Set(items));

export const resolveInstagramCarouselOverviewEventLabel = (
  eventTypes: Array<string | undefined>,
) => {
  const normalizedTypes = eventTypes
    .map((eventType) => stripDiacritics((eventType ?? "").toLowerCase()))
    .filter(Boolean);

  if (normalizedTypes.some((type) => type.includes("zlot"))) {
    return "zloty";
  }

  if (normalizedTypes.some((type) => type.includes("spotk"))) {
    return "spotkania";
  }

  return "moto eventy";
};

export const splitCarouselSummary = (summary: string, maxParagraphs = 2) =>
  summary
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, maxParagraphs);

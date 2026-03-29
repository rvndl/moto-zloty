import { EventService } from "../services/event";

export const formatFacebookPostDate = (value: string | Date) => {
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Warsaw",
  });

  return formatter.format(new Date(value));
};

export const formatFacebookPostState = (state?: string | null) => {
  if (!state) {
    return "Cała Polska";
  }

  return state
    .replace(/^województwo\s+/i, "")
    .replace(/^./, (char) => char.toUpperCase());
};

export const getRelevantEventLocation = (
  event: Awaited<ReturnType<typeof EventService.list>>[number],
) => {
  return (
    event.fullAddress?.city ??
    event.fullAddress?.suburb ??
    event.fullAddress?.neighbourhood ??
    event.fullAddress?.name ??
    event.address ??
    formatFacebookPostState(event.fullAddress?.state) ??
    "Polska"
  );
};

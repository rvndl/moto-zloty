import { format } from "date-fns";
import { pl } from "date-fns/locale";

export * from "./user";
export * from "./date";

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type ValueKind =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "daymonth";

export const getValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  kind: ValueKind = "string",
  emptyText = "-",
): string => {
  if (!value) {
    return emptyText;
  }

  switch (kind) {
    case "string":
      return value;
    case "number":
      return value.toString();
    case "boolean":
      return value ? "Tak" : "Nie";
    case "date":
      return format(value as string, "dd.MM.yyyy");
    case "datetime":
      return format(value as string, "dd.MM.yyyy HH:mm");
    case "daymonth":
      return format(value as string, "d MMMM", { locale: pl });
    default:
      return emptyText;
  }
};

export const getFilePath = (fileId?: string) => {
  if (!fileId) {
    return "/event-placeholder-vertical.webp";
  }
  return `${process.env.NEXT_PUBLIC_API_URL}file/${fileId}`;
};

export const minTwoDigits = (n: number) => {
  return (n < 10 ? "0" : "") + n;
};

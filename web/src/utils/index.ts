import { format } from "date-fns";

export * from "./user";
export * from "./date";

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type ValueKind = "string" | "number" | "boolean" | "date" | "datetime";

export const getValue = (
  value: any,
  kind: ValueKind = "string",
  emptyText = "-"
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
    default:
      return emptyText;
  }
};

export const getFilePath = (fileId?: string) => {
  if (!fileId) {
    return "/event-placeholder.png";
  }
  return `${process.env.NEXT_PUBLIC_API_URL}file/${fileId}`;
};

export const minTwoDigits = (n: number) => {
  return (n < 10 ? "0" : "") + n;
};

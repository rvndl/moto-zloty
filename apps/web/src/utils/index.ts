import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { match } from "ts-pattern";

export * from "./user";
export * from "./date";
export * from "./text-editor";

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type SymbolKind = "string" | "number";
export type BooleanKind = "boolean";
export type DateKind = "date" | "datetime" | "daymonth" | "daymonthhour";
export type ValueKind = SymbolKind | BooleanKind | DateKind;

type UniversalValue = string | number | boolean | Date | null | undefined;

export function getValue(
  value: boolean,
  kind: BooleanKind,
  emptyText?: string,
): string;

export function getValue(
  value: Date | string | number,
  kind: DateKind,
  emptyText?: string,
): string;

export function getValue(
  value: string | number,
  kind?: SymbolKind,
  emptyText?: string,
): string;

export function getValue(
  value: UniversalValue,
  kind: SymbolKind | DateKind | BooleanKind = "string",
  emptyText = "-",
): string {
  if (value === null || value === undefined || value === "") {
    return emptyText;
  }

  return match(kind)
    .with("string", () => String(value))
    .with("number", () => Number(value).toString())

    .with("boolean", () => (value ? "Tak" : "Nie"))

    .with("date", "datetime", "daymonth", "daymonthhour", (dateMode) => {
      const dateObj =
        value instanceof Date ? value : new Date(value as string | number);

      if (isNaN(dateObj.getTime())) return emptyText;

      return match(dateMode)
        .with("date", () => format(dateObj, "dd.MM.yyyy"))
        .with("datetime", () => format(dateObj, "dd.MM.yyyy HH:mm"))
        .with("daymonth", () => format(dateObj, "d MMMM", { locale: pl }))
        .with("daymonthhour", () =>
          format(dateObj, "d MMMM HH:mm", { locale: pl }),
        )
        .exhaustive();
    })
    .exhaustive();
}

export const getFilePath = (fileId?: string | null) => {
  if (!fileId) {
    return "/event-placeholder-vertical.webp";
  }

  return `${process.env.NEXT_PUBLIC_API_URL}file/${fileId}`;
};

export const minTwoDigits = (n: number) => {
  return (n < 10 ? "0" : "") + n;
};

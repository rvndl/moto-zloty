import { getValue, ValueKind } from "@utils/index";
import { Tooltip } from "./tooltip";

type DateType = Extract<ValueKind, "date" | "datetime" | "daymonth">;

interface Props {
  date: string | Date;
  type?: DateType;
  tooltip?: boolean;
}

const Date = ({ date, type = "date", tooltip }: Props) => {
  const dateStr = typeof date === "string" ? date : date.toISOString();

  return (
    <>
      <time
        {...(tooltip && {
          "data-tooltip-id": "date-tooltip",
          "data-tooltip-content": getValue(dateStr, "datetime"),
        })}
        dateTime={dateStr}
      >
        {getValue(dateStr, type)}
      </time>
      {tooltip && <Tooltip id="date-tooltip" />}
    </>
  );
};

export { Date };

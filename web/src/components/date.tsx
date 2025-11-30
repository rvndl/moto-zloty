import { getValue, ValueKind } from "@utils/index";
import { Tooltip } from "./tooltip";

type DateType = Extract<ValueKind, "date" | "datetime" | "daymonth">;

interface Props {
  date: string;
  type?: DateType;
  tooltip?: boolean;
}

const Date = ({ date, type = "date", tooltip }: Props) => {
  if (tooltip) {
    return (
      <>
        <time
          data-tooltip-id="date-tooltip"
          data-tooltip-content={getValue(date, "datetime")}
          dateTime={date}
        >
          {getValue(date, type)}
        </time>
        <Tooltip id="date-tooltip" />
      </>
    );
  }

  return <time dateTime={date}>{getValue(date, type)}</time>;
};

export { Date };

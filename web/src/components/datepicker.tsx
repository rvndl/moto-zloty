import { Button, Calendar, Label, Popover, Timepicker } from "@components";
import { CalendarIcon } from "@components/icons";
import clsx from "clsx";
import { format } from "date-fns";

interface DatepickerProps {
  label?: string;
  value?: Date;
  error?: string;
  hasTimePicker?: boolean;
  isRequired?: boolean;
  onChange?: (value: Date | undefined) => void;
}

const Datepicker = ({
  label,
  value,
  error,
  isRequired,
  onChange,
}: DatepickerProps) => {
  const handleOnSelect = (date?: Date) => onChange?.(date);

  return (
    <Popover
      trigger={
        <div
          className={clsx(
            "flex flex-col items-start",
            Boolean(label) && "gap-1"
          )}
        >
          {Boolean(label) && <Label isRequired={isRequired}>{label}</Label>}
          <Button
            variant="outline"
            icon={<CalendarIcon />}
            className={clsx(
              "font-normal shadow-sm",
              !Boolean(value) && "text-muted"
            )}
          >
            {Boolean(value)
              ? format(value!, "dd.MM.yyyy HH:mm")
              : "Wybierz datę"}
          </Button>
          {Boolean(error) && (
            <Label varaint="error" className="mt-0.5">
              {error}
            </Label>
          )}
        </div>
      }
    >
      <div className="flex gap-2">
        <Calendar mode="single" selected={value} onSelect={handleOnSelect} />
        <Timepicker date={value} onChange={handleOnSelect} />
      </div>
    </Popover>
  );
};

export { Datepicker, type DatepickerProps };

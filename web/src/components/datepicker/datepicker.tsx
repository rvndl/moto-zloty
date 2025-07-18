import clsx from "clsx";
import { format } from "date-fns";
import { DayPickerProps } from "react-day-picker";
import { Timepicker } from "./timepicker";
import { CalendarIcon } from "lucide-react";
import { Popover } from "@components/popover";
import { Label } from "@components/label";
import { Button, ButtonSize } from "@components/button";
import { HelpText } from "@components/help-text";
import { Calendar } from "@components/calendar";

interface DatepickerProps {
  label?: string;
  value?: Date;
  error?: string;
  calendarProps?: Omit<DayPickerProps, "onSelect" | "selected" | "mode">;
  size?: ButtonSize;
  placeholder?: string;
  showTimepicker?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onChange?: (value: Date | undefined) => void;
}

const Datepicker = ({
  label,
  value,
  error,
  calendarProps,
  size,
  placeholder,
  showTimepicker,
  isRequired,
  isDisabled,
  isLoading,
  onChange,
}: DatepickerProps) => {
  const handleOnSelect = (date?: Date) => onChange?.(date);

  return (
    <Popover
      trigger={
        <div
          className={clsx(
            "flex flex-col items-start",
            Boolean(label) && "gap-2",
          )}
        >
          {Boolean(label) && <Label isRequired={isRequired}>{label}</Label>}
          <Button
            as="span"
            variant="outline"
            icon={<CalendarIcon />}
            className={clsx("font-normal shadow-sm", !value && "text-muted")}
            disabled={isDisabled}
            isLoading={isLoading}
            size={size}
          >
            {value
              ? format(
                  value!,
                  showTimepicker ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy",
                )
              : (placeholder ?? "Wybierz datę")}
          </Button>
          {Boolean(error) && <HelpText variant="error">{error}</HelpText>}
        </div>
      }
      isDisabled={isDisabled}
    >
      <div className="flex gap-2">
        <Calendar
          disabled={isDisabled}
          mode="single"
          selected={value}
          onSelect={handleOnSelect}
          {...calendarProps}
        />
        {showTimepicker && (
          <Timepicker date={value} onChange={handleOnSelect} />
        )}
      </div>
    </Popover>
  );
};

export { Datepicker, type DatepickerProps };

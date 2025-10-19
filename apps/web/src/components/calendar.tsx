import clsx from "clsx";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { pl } from "date-fns/locale";

const Calendar = (props: DayPickerProps) => {
  return (
    <DayPicker
      locale={pl}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "p-2 text-sm h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border shadow-sm hover:bg-accent gap-2 rounded-md inline-flex items-center font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: clsx(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: "inline-flex items-center justify-center rounded-md font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-sm h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary hover:bg-primary text-white hover:text-white focus:bg-primary focus:text-white",
        day_today: "bg-accent",
        day_outside:
          "day-outside text-muted aria-selected:bg-accent/50 aria-selected:text-muted",
        day_disabled: "text-muted opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent",
        day_hidden: "invisible",
      }}
      showOutsideDays
      {...props}
    />
  );
};

export { Calendar };

import { minTwoDigits } from "@utils/index";
import { Button } from "../button";
import clsx from "clsx";
import { setHours, setMinutes } from "date-fns";

interface Props {
  date?: Date;
  onChange: (date: Date) => void;
}

const Timepicker = ({ date, onChange }: Props) => {
  const handleOnChange = (date: Date) => {
    onChange(date);
  };

  return (
    <div className="flex h-full gap-2 mt-1">
      <section>
        <p className="text-sm font-medium">Godzina</p>
        <div className="mt-2 overflow-auto max-h-[14.25rem]">
          {Array.from({ length: 24 }).map((_, i) => (
            <Item
              value={i}
              onClick={(hour) => handleOnChange(setHours(date!, hour))}
              isSelected={(hour) => hour === date?.getHours()}
              isDisabled={!date}
            />
          ))}
        </div>
      </section>
      <section>
        <p className="text-sm font-medium">Minuta</p>
        <div className="mt-2 overflow-auto max-h-[14.25rem]">
          {Array.from({ length: 12 }).map((_, i) => (
            <Item
              value={i * 5}
              onClick={(minute) => handleOnChange(setMinutes(date!, minute))}
              isSelected={(minute) => minute === date?.getMinutes()}
              isDisabled={!date}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

interface ItemProps {
  value: number;
  isDisabled?: boolean;
  isSelected?: (value: number) => boolean;
  onClick: (value: number) => void;
}

const Item = ({ value, isSelected, isDisabled, onClick }: ItemProps) => {
  const selected = isSelected?.(value);

  return (
    <div className={clsx("flex flex-col items-center justify-center gap-1")}>
      <Button
        variant={selected ? "primary" : "ghost"}
        textAlignment="center"
        className={clsx(
          "w-full h-8 text-sm font-normal",
          value === 0 && "rounded-l-md"
        )}
        onClick={() => onClick(value)}
        disabled={isDisabled}
      >
        {minTwoDigits(value)}
      </Button>
    </div>
  );
};

export { Timepicker };

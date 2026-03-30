import { Button } from "@components/button";
import { Listbox, type ListboxOption } from "@components/listbox";
import { WeekOption } from "@features/moderation/types/social-media";
import { getEventsCountLabel } from "@features/moderation/utils/social-media";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";

interface Props {
  week?: WeekOption;
  weekOptions: WeekOption[];
  currentIndex: number;
  totalWeeks: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const SocialWeekPicker = ({
  week,
  weekOptions,
  currentIndex,
  totalWeeks,
  onPrevious,
  onNext,
  onSelect,
}: Props) => {
  const options = useMemo<ListboxOption[]>(
    () =>
      weekOptions.map((item, index) => ({
        id: item.id,
        label: `${item.label} • ${item.count} ${getEventsCountLabel(item.count)}`,
        value: index,
      })),
    [weekOptions],
  );

  const selectedOption = options[currentIndex];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border px-2 py-2">
        <Button
          type="button"
          variant="outline"
          size="small"
          icon={<ChevronLeftIcon />}
          onClick={onPrevious}
          disabled={currentIndex <= 0 || totalWeeks === 0}
          title="Poprzedni tydzień"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="text-center">
            <p className="font-medium capitalize">
              {week?.label ?? "Brak tygodni"}
            </p>
            <p className="text-sm text-muted">
              {week
                ? `${week.count} ${getEventsCountLabel(week.count)}`
                : "Brak danych"}
            </p>
          </div>

          <div className="flex justify-center">
            <Listbox
              size="small"
              options={options}
              value={selectedOption}
              isDisabled={!options.length}
              onChange={(option) => onSelect(Number(option.value ?? 0))}
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="small"
          icon={<ChevronRightIcon />}
          onClick={onNext}
          disabled={currentIndex >= totalWeeks - 1 || totalWeeks === 0}
          title="Następny tydzień"
        />
      </div>
    </div>
  );
};

export { SocialWeekPicker };

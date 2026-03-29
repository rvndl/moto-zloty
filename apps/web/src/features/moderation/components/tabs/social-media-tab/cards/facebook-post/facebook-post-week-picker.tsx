import { Button } from "@components/button";
import { WeekOption } from "@features/moderation/types/social-media";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getEventsCountLabel } from "@features/moderation/utils/social-media";

interface Props {
  week?: WeekOption;
  currentIndex: number;
  totalWeeks: number;
  onPrevious: () => void;
  onNext: () => void;
}

const FacebookPostWeekPicker = ({
  week,
  currentIndex,
  totalWeeks,
  onPrevious,
  onNext,
}: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 rounded-xl border py-1 px-2">
        <Button
          type="button"
          variant="outline"
          size="small"
          icon={<ChevronLeftIcon />}
          onClick={onPrevious}
          disabled={currentIndex <= 0}
          title="Poprzedni tydzień"
        />

        <div className="min-w-0 flex-1 text-center">
          <p className="font-medium capitalize">
            {week?.label ?? "Brak tygodni"}
          </p>
          <p className="text-sm text-muted">
            {week
              ? `${week.count} ${getEventsCountLabel(week.count)}`
              : "Brak danych"}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="small"
          icon={<ChevronRightIcon />}
          onClick={onNext}
          disabled={currentIndex >= totalWeeks - 1}
          title="Następny tydzień"
        />
      </div>
    </div>
  );
};

export { FacebookPostWeekPicker };

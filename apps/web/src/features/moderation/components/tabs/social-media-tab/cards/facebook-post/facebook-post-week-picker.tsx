import { WeekOption } from "@features/moderation/types/social-media";
import { SocialWeekPicker } from "../shared/social-week-picker";

interface Props {
  week?: WeekOption;
  weekOptions: WeekOption[];
  currentIndex: number;
  totalWeeks: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

const FacebookPostWeekPicker = ({
  week,
  weekOptions,
  currentIndex,
  totalWeeks,
  onPrevious,
  onNext,
  onSelect,
}: Props) => {
  return (
    <SocialWeekPicker
      week={week}
      weekOptions={weekOptions}
      currentIndex={currentIndex}
      totalWeeks={totalWeeks}
      onPrevious={onPrevious}
      onNext={onNext}
      onSelect={onSelect}
    />
  );
};

export { FacebookPostWeekPicker };

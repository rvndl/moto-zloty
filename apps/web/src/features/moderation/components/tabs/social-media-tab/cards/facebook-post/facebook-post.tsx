import { Card } from "@components/card";
import { api, useMutation, useQuery } from "api/eden";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FacebookPostActions } from "./facebook-post-actions";
import { FacebookPostPreview } from "./facebook-post-preview";
import { FacebookPostWeekPicker } from "./facebook-post-week-picker";
import {
  getCalendarRange,
  getWeekOptions,
  UPCOMING_WEEKS_QUERY_KEY,
} from "@features/moderation/utils/social-media";

const { start: calendarStart, end: calendarEnd } = getCalendarRange();

const FacebookPost = () => {
  const [content, setContent] = useState("");
  const [manualWeekIndex, setManualWeekIndex] = useState<number | null>(null);

  const { data: events, isLoading: isLoadingEvents } = useQuery(
    UPCOMING_WEEKS_QUERY_KEY,
    () =>
      api.events.get({
        query: {
          dateFrom: calendarStart.toISOString(),
          dateTo: calendarEnd.toISOString(),
          sortOrder: "Asc",
          year: String(calendarStart.getFullYear()),
        },
      }),
  );

  const weekOptions = useMemo(
    () => getWeekOptions(events, calendarStart),
    [events],
  );

  const firstEventWeekIndex = useMemo(() => {
    const index = weekOptions.findIndex((week) => week.count > 0);
    return index === -1 ? 0 : index;
  }, [weekOptions]);

  const currentWeekIndex = manualWeekIndex ?? firstEventWeekIndex;
  const currentWeek = weekOptions[currentWeekIndex];

  const { mutate: generatePost, isPending: isGenerating } = useMutation(
    api.mod.socialMedia.facebook.post,
    {
      onError: (error) => {
        if (error.status === 400 || error.status === 404) {
          toast.error(error.value?.error ?? "Nie udało się wygenerować posta.");
          return;
        }

        toast.error("Wystąpił błąd podczas generowania posta.");
      },
      onSuccess: (data) => {
        setContent(data.content);
        toast.success(`Gotowe. Dodano ${data.eventCount} wydarzeń.`);
      },
    },
  );

  const handleOnGenerate = () => {
    if (!currentWeek) {
      toast.error("Brak dostępnego tygodnia do wygenerowania posta.");
      return;
    }

    generatePost({
      weeks: [
        {
          start: currentWeek.start.toISOString(),
          end: currentWeek.end.toISOString(),
          label: currentWeek.label,
        },
      ],
    });
  };

  const handleOnCopy = async () => {
    if (!content) {
      return;
    }

    await navigator.clipboard.writeText(content);
    toast.success("Skopiowano treść posta.");
  };

  const handleOnPreviousWeek = () => {
    setManualWeekIndex((current) => {
      const nextIndex = (current ?? firstEventWeekIndex) - 1;
      return Math.max(0, nextIndex);
    });
  };

  const handleOnNextWeek = () => {
    setManualWeekIndex((current) => {
      const nextIndex = (current ?? firstEventWeekIndex) + 1;
      return Math.min(weekOptions.length - 1, nextIndex);
    });
  };

  return (
    <Card
      title="Facebook"
      description="Przeglądaj tygodnie i wygeneruj gotowy post o nadchodzących wydarzeniach."
    >
      <div className="">
        <section className="space-y-4">
          <FacebookPostWeekPicker
            week={currentWeek}
            currentIndex={currentWeekIndex}
            totalWeeks={weekOptions.length}
            onPrevious={handleOnPreviousWeek}
            onNext={handleOnNextWeek}
          />
          <FacebookPostPreview content={content} />
          <FacebookPostActions
            hasContent={Boolean(content)}
            isDisabled={!currentWeek}
            isGenerating={isGenerating}
            isLoadingEvents={isLoadingEvents}
            onCopy={handleOnCopy}
            onGenerate={handleOnGenerate}
          />
        </section>
      </div>
    </Card>
  );
};

export { FacebookPost };

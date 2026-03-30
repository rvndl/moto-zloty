import { Button } from "@components/button";
import { Card } from "@components/card";
import { api, useMutation, useQuery } from "api/eden";
import { Event } from "@features/event/types/event";
import { getFilePath } from "@utils/index";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CopyIcon, ImageIcon, SendIcon, SparklesIcon } from "lucide-react";
import { SocialWeekPicker } from "../shared/social-week-picker";
import {
  getCalendarRange,
  getWeekOptions,
  UPCOMING_WEEKS_QUERY_KEY,
} from "@features/moderation/utils/social-media";
import {
  InstagramCarouselPreview,
  type PreviewData,
} from "./instagram-carousel-preview";

const { start: calendarStart, end: calendarEnd } = getCalendarRange();

const getWeekEvents = (events: Event[] | undefined, start: Date, end: Date) => {
  return (
    events?.filter((event) => {
      const eventDate = new Date(event.dateFrom);
      return eventDate >= start && eventDate <= end;
    }) ?? []
  );
};

const getEventLocation = (event: Event) => {
  return (
    event.fullAddress?.city ??
    event.fullAddress?.suburb ??
    event.fullAddress?.neighbourhood ??
    event.fullAddress?.name ??
    event.address ??
    event.fullAddress?.state ??
    "Polska"
  );
};

const InstagramCarousel = () => {
  const [manualWeekIndex, setManualWeekIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);

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

  const weekEvents = useMemo(
    () =>
      currentWeek
        ? getWeekEvents(events, currentWeek.start, currentWeek.end).sort(
            (eventA, eventB) =>
              new Date(eventA.dateFrom).getTime() -
              new Date(eventB.dateFrom).getTime(),
          )
        : [],
    [currentWeek, events],
  );

  const buildPayload = (dryRun: boolean) => {
    if (!currentWeek) {
      return null;
    }

    return {
      weekLabel: currentWeek.label,
      weekStart: currentWeek.start.toISOString(),
      weekEnd: currentWeek.end.toISOString(),
      aspectRatio: "4:5" as const,
      dryRun,
      events: weekEvents.map((event) => ({
        name: event.name,
        date: event.dateFrom,
        location: getEventLocation(event),
        state: event.fullAddress?.state ?? "Cała Polska",
        imageUrl: getFilePath(event.bannerId ?? event.bannerSmallId),
      })),
    };
  };

  const { mutate: generatePreview, isPending: isGeneratingPreview } =
    useMutation(api.api["publish-weekly-events"].post, {
      onError: (error) => {
        if (
          error.status === 400 ||
          error.status === 500 ||
          error.status === 504
        ) {
          toast.error(
            error.value?.error ??
              "Nie udało się wygenerować podglądu karuzeli.",
          );
          return;
        }

        toast.error("Wystąpił błąd podczas generowania podglądu karuzeli.");
      },
      onSuccess: (data) => {
        setPreview(data as PreviewData);
        toast.success(`Gotowe. Wygenerowano ${data.slides.length} slajdów.`);
      },
    });

  const { mutate: publishCarousel, isPending: isPublishing } = useMutation(
    api.api["publish-weekly-events"].post,
    {
      onError: (error) => {
        if (
          error.status === 400 ||
          error.status === 500 ||
          error.status === 504
        ) {
          toast.error(
            error.value?.error ?? "Nie udało się opublikować karuzeli.",
          );
          return;
        }

        toast.error("Wystąpił błąd podczas publikacji karuzeli.");
      },
      onSuccess: (data) => {
        setPreview(data as PreviewData);
        toast.success("Karuzela została opublikowana na Instagramie.");
      },
    },
  );

  const handleGeneratePreview = () => {
    const payload = buildPayload(true);

    if (!payload || !currentWeek) {
      toast.error("Wybierz tydzień do wygenerowania karuzeli.");
      return;
    }

    if (!weekEvents.length) {
      toast.error("Brak wydarzeń w wybranym tygodniu.");
      return;
    }

    generatePreview(payload);
  };

  const handlePublish = () => {
    const payload = buildPayload(false);

    if (!payload || !currentWeek) {
      toast.error("Wybierz tydzień do publikacji karuzeli.");
      return;
    }

    if (!weekEvents.length) {
      toast.error("Brak wydarzeń w wybranym tygodniu.");
      return;
    }

    publishCarousel(payload);
  };

  const handleCopyCaption = async () => {
    if (!preview?.caption) {
      return;
    }

    await navigator.clipboard.writeText(preview.caption);
    toast.success("Skopiowano podpis karuzeli.");
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
      title="Instagram carousel"
      description="Wybierz tydzień, wygeneruj slajdy i opublikuj gotową karuzelę o najbliższych wydarzeniach."
    >
      <div className="space-y-4">
        <SocialWeekPicker
          week={currentWeek}
          currentIndex={currentWeekIndex}
          totalWeeks={weekOptions.length}
          weekOptions={weekOptions}
          onPrevious={handleOnPreviousWeek}
          onNext={handleOnNextWeek}
          onSelect={setManualWeekIndex}
        />

        <div className="rounded-xl border bg-accent/40 p-4 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ImageIcon size={16} />
            <span>{currentWeek?.count ?? 0} wydarzeń w wybranym tygodniu</span>
          </div>
          <p className="mt-2 text-muted">
            Generator użyje banerów wydarzeń, zbuduje slajd otwierający oraz
            osobne slajdy dla województw aktywnych w tym tygodniu.
          </p>
        </div>

        <InstagramCarouselPreview preview={preview} />

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            icon={<CopyIcon />}
            onClick={handleCopyCaption}
            disabled={!preview?.caption}
          >
            Kopiuj podpis
          </Button>
          <Button
            type="button"
            variant="outline"
            icon={<SparklesIcon />}
            onClick={handleGeneratePreview}
            isLoading={isGeneratingPreview}
            disabled={
              isLoadingEvents ||
              isGeneratingPreview ||
              isPublishing ||
              !currentWeek ||
              !weekEvents.length
            }
            loadingText="Generowanie podglądu..."
          >
            Generuj podgląd
          </Button>
          <Button
            type="button"
            icon={<SendIcon />}
            onClick={handlePublish}
            isLoading={isPublishing}
            disabled={
              isLoadingEvents ||
              isGeneratingPreview ||
              isPublishing ||
              !currentWeek ||
              !weekEvents.length
            }
            loadingText="Publikowanie karuzeli..."
          >
            Publikuj karuzelę
          </Button>
        </div>
      </div>
    </Card>
  );
};

export { InstagramCarousel };

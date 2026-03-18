import { Button } from "@components/button";
import { Card } from "@components/card";
import { Input } from "@components/input";
import { Listbox, ListboxOption } from "@components/listbox";
import { useQueryClient } from "@tanstack/react-query";
import { api, useMutation, useQuery } from "api/eden";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
type SeenFilter = "all" | "seen" | "unseen";

const SCRAPER_LIST_QUERY_KEY = ["SCRAPER_LIST_QUERY_KEY"];
const FILTER_OPTIONS: ListboxOption[] = [
  { id: "all", label: "Wszystkie", value: "all" },
  { id: "unseen", label: "Nieprzeczytane", value: "unseen" },
  { id: "seen", label: "Przeczytane", value: "seen" },
];

interface Props {
  onApply: (
    title: string,
    imageUrl: string | null,
    description: string | null,
    place: string | null,
  ) => void;
}

const Scrape = ({ onApply }: Props) => {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [filter, setFilter] = useState<ListboxOption>(FILTER_OPTIONS[0]);

  const { mutate: scrapeUrl, isPending: isScraping } = useMutation(
    api.scraper.post,
  );

  const { mutate: markAsSeen, isPending: isMarkingSeen } = useMutation(
    ({ id }: { id: string }) => api.scraper({ id }).seen.patch(),
  );

  const { data: list, isLoading: isLoadingList } = useQuery(
    SCRAPER_LIST_QUERY_KEY,
    api.scraper.get,
  );

  const scrapes = useMemo(
    () => (list?.success ? (list.data.scrapes ?? []) : []),
    [list],
  );

  const filteredScrapes = useMemo(() => {
    const selectedFilter = (filter.value as SeenFilter) ?? "all";

    if (selectedFilter === "seen") {
      return scrapes.filter((scrape) => scrape.seen);
    }

    if (selectedFilter === "unseen") {
      return scrapes.filter((scrape) => !scrape.seen);
    }

    return scrapes;
  }, [filter.value, scrapes]);

  const currentScrape = filteredScrapes[activeIndex];

  useEffect(() => {
    if (activeIndex > filteredScrapes.length - 1) {
      setActiveIndex(Math.max(filteredScrapes.length - 1, 0));
    }
  }, [activeIndex, filteredScrapes.length]);

  const handleOnScrape = () => {
    if (!url.trim()) {
      toast.error("Podaj URL do scrapowania");
      return;
    }

    scrapeUrl(
      { url },
      {
        onSuccess: (data) => {
          if (!data.success) {
            return;
          }

          setUrl("");
          toast.success(
            `Dodano ${data.data.scrapes.length} wpisów do bazy danych`,
          );
          queryClient.invalidateQueries({ queryKey: SCRAPER_LIST_QUERY_KEY });
        },
        onError: () => toast.error("Scraping failed"),
      },
    );
  };

  const handleOnMarkAsSeen = () => {
    if (!currentScrape || currentScrape.seen) {
      return;
    }

    markAsSeen(
      { id: currentScrape.id },
      {
        onSuccess: () => {
          toast.success("Oznaczono jako przeczytane");
          queryClient.invalidateQueries({ queryKey: SCRAPER_LIST_QUERY_KEY });
        },
        onError: () => {
          toast.error("Nie udało się oznaczyć wpisu");
        },
      },
    );
  };

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      Math.min(filteredScrapes.length - 1, prevIndex + 1),
    );
  };

  return (
    <Card
      title="Scraper"
      className="fixed right-0 bottom-0 top-40 max-w-96 w-full overflow-y-auto"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            size="small"
            placeholder="Wpisz URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            onClick={handleOnScrape}
            size="small"
            isLoading={isScraping}
            disabled={isScraping}
          >
            Scrape
          </Button>
        </div>

        <Listbox
          size="small"
          label="Filtr"
          options={FILTER_OPTIONS}
          value={filter}
          onChange={(option) => {
            setFilter(option);
            setActiveIndex(0);
          }}
        />

        {!currentScrape && !isLoadingList && (
          <div className="rounded-md border p-3 text-sm text-muted">
            Brak wpisów dla wybranego filtra.
          </div>
        )}

        {currentScrape && (
          <div className="rounded-md border p-3 flex flex-col gap-3">
            <div className="w-full h-40 rounded-md overflow-hidden border bg-accent flex items-center justify-center text-sm text-muted">
              {currentScrape.imageUrl ? (
                <img
                  src={currentScrape.imageUrl}
                  alt={currentScrape.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                "Brak banera"
              )}
            </div>

            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-tight">
                {currentScrape.title}
              </h3>
              <span className="text-xs rounded-md border px-2 py-1 shrink-0">
                {currentScrape.seen ? "Przeczytane" : "Nieprzeczytane"}
              </span>
            </div>

            <p className="text-sm text-muted whitespace-pre-wrap">
              {currentScrape.description || "Brak opisu"}
            </p>

            <a
              href={currentScrape.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline break-all"
            >
              {currentScrape.sourceUrl}
            </a>

            <div className="flex items-center gap-2">
              <Button
                className="w-full"
                variant="outline"
                size="small"
                onClick={handleOnMarkAsSeen}
                disabled={currentScrape.seen || isMarkingSeen}
                isLoading={isMarkingSeen}
              >
                Oznacz jako przeczytane
              </Button>
              <Button
                size="small"
                onClick={() => {
                  onApply(
                    currentScrape.title,
                    currentScrape.imageUrl,
                    currentScrape.description,
                    currentScrape.place,
                  );
                }}
              >
                Dodaj
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 justify-between">
          <Button
            icon={<ArrowLeftIcon />}
            variant="ghost"
            size="small"
            onClick={handlePrevious}
            disabled={activeIndex === 0 || !currentScrape}
          />
          <span className="text-xs text-muted">
            {filteredScrapes.length ? activeIndex + 1 : 0} /{" "}
            {filteredScrapes.length}
          </span>
          <Button
            icon={<ArrowRightIcon />}
            variant="ghost"
            size="small"
            onClick={handleNext}
            disabled={
              !currentScrape || activeIndex >= filteredScrapes.length - 1
            }
          />
        </div>
      </div>
    </Card>
  );
};

export { Scrape };

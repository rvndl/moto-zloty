import { Textarea } from "@components/textarea";
import { Card } from "@components/card";

interface SlidePreview {
  kind: "overview" | "state";
  title: string;
  state?: string;
  publicUrl: string;
}

interface PreviewData {
  caption: string;
  hashtags: string[];
  aspectRatio: "1:1" | "4:5";
  eventCount: number;
  stateCount: number;
  dryRun: boolean;
  slides: SlidePreview[];
  carouselContainerId: string | null;
  publishedMediaId: string | null;
}

interface Props {
  preview: PreviewData | null;
}

const InstagramCarouselPreview = ({ preview }: Props) => {
  if (!preview) {
    return (
      <div className="rounded-xl border border-dashed p-4 text-sm text-muted">
        Wybierz tydzień i wygeneruj podgląd karuzeli, aby zobaczyć podpis oraz
        slajdy.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Card className="p-3" contentClassName="mt-2">
          <p className="text-xs uppercase tracking-wide text-muted">
            Wydarzenia
          </p>
          <p className="mt-1 text-2xl font-semibold">{preview.eventCount}</p>
        </Card>
        <Card className="p-3" contentClassName="mt-2">
          <p className="text-xs uppercase tracking-wide text-muted">
            Województwa
          </p>
          <p className="mt-1 text-2xl font-semibold">{preview.stateCount}</p>
        </Card>
        <Card className="p-3" contentClassName="mt-2">
          <p className="text-xs uppercase tracking-wide text-muted">Format</p>
          <p className="mt-1 text-2xl font-semibold">{preview.aspectRatio}</p>
        </Card>
        <Card className="p-3" contentClassName="mt-2">
          <p className="text-xs uppercase tracking-wide text-muted">Status</p>
          <p className="mt-1 text-sm font-semibold">
            {preview.dryRun ? "Podgląd wygenerowany" : "Karuzela opublikowana"}
          </p>
        </Card>
      </div>

      <Textarea
        label="Podpis posta"
        rows={8}
        readOnly
        value={preview.caption}
        placeholder="Tutaj pojawi się wygenerowany podpis."
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Slajdy karuzeli</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {preview.slides.map((slide, index) => (
            <div
              key={`${slide.publicUrl}-${index}`}
              className="rounded-xl border p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{slide.title}</p>
                  <p className="text-xs text-muted">
                    {slide.kind === "overview"
                      ? "Slajd otwierający"
                      : (slide.state ?? "Slajd województwa")}
                  </p>
                </div>
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted">
                  {index + 1}
                </span>
              </div>
              <div className="overflow-hidden rounded-lg border bg-accent">
                <img
                  src={slide.publicUrl}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {preview.publishedMediaId && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          Opublikowano karuzelę. Media ID: {preview.publishedMediaId}
        </div>
      )}
    </div>
  );
};

export { InstagramCarouselPreview };
export type { PreviewData };

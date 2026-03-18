import { Card } from "@components/card";
import { DropzoneImage } from "@components/dropzone";
import { Form } from "@components/form";
import { Tabs } from "@components/tabs";

import { yup } from "@utils/yup";
import { api, useMutation } from "api/eden";
import toast from "react-hot-toast";
import { match } from "ts-pattern";
import { AIScrapTab, EventCreationTab } from "./tabs";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Scrape } from "../../scrape";

const schema = yup.object({
  name: yup.string().required().min(3).max(64),
  address: yup
    .object({
      value: yup.object({
        lat: yup.number().required(),
        lon: yup.number().required(),
        address: yup.object().required(),
      }),
    })
    .required(),
  description: yup.string().required().min(10).max(5000),
  dateFrom: yup.date().required(),
  dateTo: yup.date().required(),
  banner: yup
    .object({
      fullId: yup.string().optional(),
      smallId: yup.string().optional(),
    })
    .optional(),
});

type Fields = yup.InferType<typeof schema>;

const QuickAddTab = () => {
  const [tab, setTab] = useState<
    "Tworzenie wydarzenia" | "Odczytywanie danych z plakatu"
  >("Tworzenie wydarzenia");
  const [scrapBanner, setScrapBanner] = useState<DropzoneImage>();
  const [scrapAdditionalInfo, setScrapAdditionalInfo] = useState("");

  const { mutate: createEvent, isPending: isCreatingEvent } = useMutation(
    api.events.put,
  );

  const handleOnSubmit = ({
    dateFrom,
    dateTo,
    address: {
      value: { lat, lon, address: addressValue },
    },
    banner,
    name,
    description,
  }: Fields) => {
    createEvent(
      {
        name,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        address: addressValue,
        latitude: lat,
        longitude: lon,
        bannerId: banner?.fullId,
        bannerSmallId: banner?.smallId,
        description,
      },
      {
        onSuccess: async (data) => {
          await api
            .events({ id: data.id })
            .updateStatus.put({ status: "approved" });

          toast.success("Wydarzenie zostało utworzone!");
        },
      },
    );
  };

  const handleOnScrapeApply = async (
    title: string,
    imageUrl: string | null,
    description: string | null,
    place: string | null,
  ) => {
    setTab("Odczytywanie danych z plakatu");

    const additionalInfoParts = [
      title ? `Tytuł: ${title}` : null,
      place ? `Miejsce: ${place}` : null,
      description ? `Opis: ${description}` : null,
    ].filter(Boolean);

    setScrapAdditionalInfo(additionalInfoParts.join("\n\n"));

    if (!imageUrl) {
      setScrapBanner(undefined);
      return;
    }

    try {
      const uploadResponse = await api.scraper.image.post({ url: imageUrl });
      if (!uploadResponse.data) {
        throw new Error("Nie udało się przesłać obrazu");
      }

      setScrapBanner({
        fullId: uploadResponse.data.full_id,
        smallId: uploadResponse.data.small_id,
      });
      toast.success("Obraz ze scrapera został ustawiony");
    } catch {
      setScrapBanner(undefined);
      toast.error("Nie udało się ustawić obrazu ze scrapera");
    }
  };

  return (
    <>
      <Card
        title="Szybkie dodawanie"
        description="Uzupełnij dane wydarzenia wykorzystując AI"
      >
        <Form<Fields>
          onSubmit={handleOnSubmit}
          resolver={yupResolver(schema as unknown as yup.ObjectSchema<object>)}
        >
          <Tabs
            activeTab={tab}
            tabs={["Tworzenie wydarzenia", "Odczytywanie danych z plakatu"]}
            onChange={setTab}
          />

          {match(tab)
            .with("Tworzenie wydarzenia", () => (
              <EventCreationTab isCreatingEvent={isCreatingEvent} />
            ))
            .with("Odczytywanie danych z plakatu", () => (
              <AIScrapTab
                banner={scrapBanner}
                additionalInfo={scrapAdditionalInfo}
                onBannerChange={setScrapBanner}
                onAdditionalInfoChange={setScrapAdditionalInfo}
              />
            ))
            .exhaustive()}
        </Form>
      </Card>

      <Scrape onApply={handleOnScrapeApply} />
    </>
  );
};

export { QuickAddTab };

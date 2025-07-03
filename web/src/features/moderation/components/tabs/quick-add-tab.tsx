import { AutocompleteOption } from "@components/autocomplete";
import { Button } from "@components/button";
import { Card } from "@components/card";
import { DropzoneImage } from "@components/dropzone";
import {
  DatepickerField,
  DropzoneField,
  Form,
  InputField,
  TextEditorField,
} from "@components/form";
import { Value } from "@components/value";
import { useAuth } from "@features/auth";
import { useCreateEventMutation } from "@features/event/api";
import { SearchAddressField } from "@features/event/components/fields";
import { useBannerScrapQuery } from "@features/moderation/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { parseISO } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

interface Fields {
  name: string;
  description?: string;
  date_from: Date;
  date_to: Date;
  longitude: number;
  latitude: number;
  address: AutocompleteOption;
  banner: DropzoneImage;
}

const schema = yup.object<Fields>({
  name: yup.string().required().min(3).max(64),
  address: yup.object().required(),
  date_from: yup.date().required(),
  date_to: yup.date().required(),
});

const QuickAddTab = () => {
  const [scrapBanner, setScrapBanner] = useState<DropzoneImage>();
  const [banner, setBanner] = useState<DropzoneImage>();
  const { isFetching, data, refetch } = useBannerScrapQuery(
    scrapBanner?.full_id || "",
    {
      enabled: !!scrapBanner?.full_id,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const { mutate: createEvent, isPending } = useCreateEventMutation();
  const { user } = useAuth();

  const isLoading = isFetching || isPending;

  const handleOnSubmit = ({
    date_from,
    date_to,
    address: {
      // @ts-expect-error TODO: extend typings
      value: { lat, lon, address: addressValue },
    },
    banner,
    ...rest
  }: Fields) => {
    const actualBanner = banner ?? scrapBanner;
    createEvent(
      {
        ...rest,
        date_from: date_from.toISOString(),
        date_to: date_to.toISOString(),
        address: addressValue,
        lat,
        lon,
        account_id: user.id!,
        banner_id: actualBanner?.full_id,
        banner_small_id: actualBanner?.small_id,
      },
      {
        onSuccess: () => {
          toast.success("Wydarzenie zostało utworzone!");
        },
      },
    );
  };

  return (
    <Card
      title="Szybkie dodawanie"
      description="Uzupełnij dane wydarzenia na podstanie plakatu"
    >
      <Form<Fields>
        onSubmit={handleOnSubmit}
        resolver={yupResolver(schema)}
        values={{
          name: data?.name,
          date_from: data?.date_from ? parseISO(data.date_from) : null,
          date_to: data?.date_to ? parseISO(data.date_to) : null,
          description: data?.description,
          banner,
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-4">
              <DropzoneField
                name="scrapBanner"
                label="Plakat"
                isRequired
                onChange={(value) => setScrapBanner(value)}
              />
              <DropzoneField
                name="banner"
                label="Alternatywny plakat"
                onChange={(value) => setBanner(value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <InputField
                name="name"
                label="Nazwa"
                isRequired
                disabled={isLoading}
              />
              <Value title="Odczytany adres" isLoading={isLoading}>
                {data?.location ?? "Brak"}
              </Value>
              <SearchAddressField
                name="address"
                label="Adres"
                isDisabled={isLoading}
              />
              <div className="grid grid-cols-2 gap-4">
                <DatepickerField
                  name="date_from"
                  label="Data rozpoczęcia"
                  showTimepicker
                  isRequired
                  isDisabled={isLoading}
                />
                <DatepickerField
                  name="date_to"
                  label="Data zakończenia"
                  showTimepicker
                  isRequired
                  isDisabled={isLoading}
                />
              </div>
            </div>
          </div>
          <div>
            <TextEditorField
              key={
                data?.description +
                (banner?.full_id || "") +
                (scrapBanner?.full_id || "")
              }
              name="description"
              label="Opis"
              isRequired
              isMarkdownValue
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
              isLoading={isFetching}
              disabled={isLoading || !scrapBanner?.full_id}
            >
              Przegeneruj
            </Button>
            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              Dodaj wydarzenie
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export { QuickAddTab };

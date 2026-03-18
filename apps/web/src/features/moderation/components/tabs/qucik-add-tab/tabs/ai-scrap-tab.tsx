import { Button } from "@components/button";
import { Dropzone, DropzoneImage } from "@components/dropzone";
import { useForm } from "@components/form";
import { Textarea } from "@components/textarea";
import { api, useMutation } from "api/eden";
import { ChangeEvent } from "react";

interface Props {
  banner?: DropzoneImage;
  additionalInfo: string;
  onBannerChange: (image?: DropzoneImage) => void;
  onAdditionalInfoChange: (value: string) => void;
}

const AIScrapTab = ({
  banner,
  additionalInfo,
  onBannerChange,
  onAdditionalInfoChange,
}: Props) => {
  const { mutate: scrapData, isPending } = useMutation(
    api.mod.bannerScrap.post,
  );

  const form = useForm();

  const handleOnAdditionaInfoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onAdditionalInfoChange(e.target.value);
  };

  const handleOnDropzoneChange = (image?: DropzoneImage) => {
    onBannerChange(image);
  };

  const handleOnSubmit = () => {
    if (!banner) {
      return;
    }

    scrapData(
      {
        fileId: banner.fullId,
        additionalInfo,
      },
      {
        onSuccess: (data) => {
          if (data.dateFrom) {
            form.setValue("dateFrom", new Date(data.dateFrom));
          }

          if (data.dateTo) {
            form.setValue("dateTo", new Date(data.dateTo));
          }

          form.setValue("name", data.name ?? "");
          form.setValue("description", data.description ?? "");

          form.setValue("location", data.location ?? "");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4">
        <Dropzone label="Plakat" onChange={handleOnDropzoneChange} />
      </div>
      <div>
        <Textarea
          name="description"
          label="Dodatkowe informacje"
          rows={12}
          value={additionalInfo}
          onChange={handleOnAdditionaInfoChange}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          onClick={handleOnSubmit}
          disabled={isPending || !banner}
          isLoading={isPending}
          loadingText="Odczytywanie danych..."
        >
          Odczytaj dane
        </Button>
      </div>
    </div>
  );
};

export { AIScrapTab };

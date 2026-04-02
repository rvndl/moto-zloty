import { Button } from "@components/button";
import { useForm } from "@components/form";
import { InputField } from "@components/form/fields/input-field";
import { DatepickerField } from "@components/form/fields/datepicker-field";
import { DropzoneField } from "@components/form/fields/dropzone-field";
import { Value } from "@components/value";
import { SearchAddressField } from "@features/event";
import dynamic from "next/dynamic";

const TextEditorField = dynamic(
  () =>
    import("@components/form/fields/text-editor-field").then(
      (mod) => mod.TextEditorField,
    ),
  { ssr: false },
);

interface Props {
  isCreatingEvent: boolean;
}

const EventCreationTab = ({ isCreatingEvent }: Props) => {
  const form = useForm();
  const location = form.watch("location");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-4">
          <DropzoneField name="banner" label="Plakat" />
        </div>

        <div className="flex flex-col gap-2">
          <InputField
            name="name"
            label="Nazwa"
            isRequired
            disabled={isCreatingEvent}
          />
          <Value title="Odczytany adres" isLoading={isCreatingEvent}>
            <a
              className="underline"
              href={`https://www.google.com/search?q=${encodeURIComponent(location ?? "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {location ?? "Brak"}
            </a>
          </Value>
          <SearchAddressField
            name="address"
            label="Adres"
            isDisabled={isCreatingEvent}
          />
          <div className="grid grid-cols-2 gap-4">
            <DatepickerField
              name="dateFrom"
              label="Data rozpoczęcia"
              showTimepicker
              isRequired
              isDisabled={isCreatingEvent}
            />
            <DatepickerField
              name="dateTo"
              label="Data zakończenia"
              showTimepicker
              isRequired
              isDisabled={isCreatingEvent}
            />
          </div>
        </div>
      </div>
      <div>
        <TextEditorField
          name="description"
          label="Opis"
          isRequired
          isMarkdownValue
          key="opis"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={isCreatingEvent}
          isLoading={isCreatingEvent}
        >
          Dodaj wydarzenie
        </Button>
      </div>
    </div>
  );
};

export { EventCreationTab };

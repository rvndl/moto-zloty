import {
  AutocompleteField,
  AutocompleteOption,
  Button,
  Dialog,
  DropzoneField,
  DropzoneImage,
  Form,
  InputField,
} from "@components";
import { useAuth } from "@features/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Api } from "api";
import { yup } from "@utils/yup";
import toast from "react-hot-toast";
import { Place } from "types/place";
import { useCreateEventMutation } from "../../api";
import { PreviewMap } from "../preview-map";
import { DatePicker } from "./date-picker";
import dynamic from "next/dynamic";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/router";

interface Fields {
  name: string;
  description?: string;
  date_from: Date;
  date_to: Date;
  longitude: number;
  latitude: number;
  address: AutocompleteOption;
  banner?: DropzoneImage;
}

const schema = yup.object<Fields>({
  name: yup.string().required().min(3).max(64),
  address: yup.object().required(),
  date_from: yup.date().required(),
  date_to: yup.date().required(),
});

const CreateEventDialog = () => {
  const {
    user: { id: account_id },
  } = useAuth<true>();

  const { mutateAsync: createEvent, isPending } = useCreateEventMutation();
  const router = useRouter();

  const TextEditorField = dynamic(
    () =>
      import("@components/form/fields/text-editor-field").then(
        (mod) => mod.TextEditorField
      ),
    { ssr: false }
  );

  const handleOnCreate =
    (close: () => void) =>
    ({
      date_from,
      date_to,
      address: {
        // @ts-expect-error TODO: extend typings
        value: { latitude, longitude, name },
      },
      banner,
      ...rest
    }: Fields) => {
      createEvent(
        {
          ...rest,
          date_from: date_from.toISOString(),
          date_to: date_to.toISOString(),
          address: name,
          longitude,
          latitude,
          account_id,
          banner_id: banner?.full_id,
          banner_small_id: banner?.small_id,
        },
        {
          onSuccess: (data) => {
            toast.success("Wydarzenie zostało utworzone!");
            close();
            router.push(`/event/${data.id}`);
          },
        }
      );
    };

  return (
    <Dialog
      trigger={<Button icon={<PlusIcon />}>Dodaj</Button>}
      title="Nowe wydarzenie"
      description="Utwórz nowe wydarzenie"
    >
      {(close) => (
        <Form<Fields>
          onSubmit={handleOnCreate(close)}
          resolver={yupResolver(schema)}
        >
          <section className="flex flex-col gap-4 md:gap-8 md:flex-row">
            <div className="flex flex-col gap-4 w-auto md:w-[32rem]">
              <InputField
                name="name"
                label="Nazwa"
                placeholder="Nazwa wydarzenia"
                isRequired
              />
              <DropzoneField name="banner" label="Banner" />
              <DatePicker />
              <div className="h-[294px]">
                <TextEditorField
                  name="description"
                  label="Opis"
                  placeholder="Opis wydarzenia"
                  isRequired
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 w-auto md:w-[32rem]">
              <AutocompleteField
                name="address"
                label="Adress"
                placeholder="Wyszukaj lokalizację..."
                fetch={async (query) => {
                  const res = await Api.get<Place[]>(`/place_search/${query}`);
                  return res.data.map(
                    (place) =>
                      ({
                        id: place.place_id,
                        label: place.name,
                        value: place,
                      } satisfies AutocompleteOption)
                  );
                }}
                isRequired
              />
              <PreviewMap className="h-[24rem] md:h-[32rem] md:w-[32rem]" />
            </div>
          </section>
          <section className="flex flex-row-reverse gap-2">
            <Button
              variant="primary"
              type="submit"
              isLoading={isPending}
              disabled={isPending}
            >
              Utwórz wydarzenie
            </Button>
            <Button variant="ghost" onClick={close}>
              Anuluj
            </Button>
          </section>
        </Form>
      )}
    </Dialog>
  );
};

export { CreateEventDialog };

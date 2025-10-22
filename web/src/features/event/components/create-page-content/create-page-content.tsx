import { useAuth } from "@features/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import toast from "react-hot-toast";
import { useCreateEventMutation } from "../../api";
import { PreviewMap } from "../preview-map";
import { DatePicker } from "./date-picker";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { SearchAddressField } from "../fields";
import { DropzoneImage } from "@components/dropzone";
import { AutocompleteOption } from "@components/autocomplete";
import { Button } from "@components/button";
import { Form } from "@components/form";
import { DropzoneField, InputField } from "@components/form/fields";
import { Card } from "@components/card";
import Link from "next/link";

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

const CreatePageContent = () => {
  const {
    user: { id: account_id },
  } = useAuth<true>();

  const { mutateAsync: createEvent, isPending } = useCreateEventMutation();
  const router = useRouter();

  const TextEditorField = dynamic(
    () =>
      import("@components/form/fields/text-editor-field").then(
        (mod) => mod.TextEditorField,
      ),
    { ssr: false },
  );

  const handleOnCreate = ({
    date_from,
    date_to,
    address: {
      // @ts-expect-error TODO: extend typings
      value: { lat, lon, address: addressValue },
    },
    banner,
    ...rest
  }: Fields) => {
    createEvent(
      {
        ...rest,
        date_from: date_from.toISOString(),
        date_to: date_to.toISOString(),
        address: addressValue,
        lat,
        lon,
        account_id,
        banner_id: banner?.full_id,
        banner_small_id: banner?.small_id,
      },
      {
        onSuccess: (data) => {
          toast.success("Wydarzenie zostało utworzone!");
          router.push(`/wydarzenie/${data.id}`);
        },
      },
    );
  };

  return (
    <Card
      title="Szczegóły wydarzenia"
      description="Uzupełnij dane dotyczące wydarzenia"
    >
      <Form<Fields> onSubmit={handleOnCreate} resolver={yupResolver(schema)}>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 md:flex-row">
          <div className="flex flex-col gap-4 w-auto">
            <InputField
              name="name"
              label="Nazwa"
              placeholder="Nazwa wydarzenia"
              isRequired
            />
            <DropzoneField name="banner" label="Plakat" />
            <DatePicker />
            <TextEditorField
              name="description"
              label="Opis"
              placeholder="Opis wydarzenia"
              isRequired
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            <SearchAddressField name="address" />
            <PreviewMap className="aspect-square h-full md:w-full" />
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
          <Link href="/">
            <Button
              variant="outline"
              isLoading={isPending}
              disabled={isPending}
            >
              Anuluj
            </Button>
          </Link>
        </section>
      </Form>
    </Card>
  );
};

export { CreatePageContent };

import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import toast from "react-hot-toast";
import { api, useMutation } from "api/eden";
import { PreviewMap } from "../../shared/preview-map";
import { DatePicker } from "./date-picker";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { SearchAddressField } from "../../fields";
import { DropzoneImage } from "@components/dropzone";
import { AutocompleteOption } from "@components/autocomplete";
import { Button } from "@components/button";
import { Form } from "@components/form";
import { InputField } from "@components/form/fields/input-field";
import { DropzoneField } from "@components/form/fields/dropzone-field";
import { Card } from "@components/card";
import Link from "next/link";

interface Fields {
  name: string;
  description?: string;
  dateFrom: Date;
  dateTo: Date;
  longitude: number;
  latitude: number;
  address: AutocompleteOption<{ lat: string; lon: string; address: unknown }>;
  banner?: DropzoneImage;
}

const schema = yup.object<Fields>({
  name: yup.string().required().min(3).max(64),
  address: yup.object().required(),
  dateFrom: yup.date().required(),
  dateTo: yup.date().required(),
});

const CreateView = () => {
  const { mutateAsync: createEvent, isPending } = useMutation(
    (body: Parameters<typeof api.events.put>[0]) => api.events.put(body),
  );

  const router = useRouter();

  const TextEditorField = dynamic(
    () =>
      import("@components/form/fields/text-editor-field").then(
        (mod) => mod.TextEditorField,
      ),
    { ssr: false },
  );

  const handleOnCreate = ({
    dateFrom,
    dateTo,
    address,
    banner,
    ...rest
  }: Fields) => {
    const { lat, lon, address: addressValue } = address?.value || {};
    if (!lat || !lon || !addressValue) {
      return;
    }

    createEvent(
      {
        ...rest,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        address: addressValue,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        bannerId: banner?.fullId,
        bannerSmallId: banner?.smallId,
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
      <Form<Fields>
        onSubmit={handleOnCreate}
        resolver={yupResolver(schema as unknown as yup.ObjectSchema<object>)}
      >
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

export { CreateView };

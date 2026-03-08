import { AutocompleteOption } from "@components/autocomplete";
import { Button } from "@components/button";
import { Dialog, OpenRef } from "@components/dialog";
import { Form } from "@components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { PreviewMap } from "../../../../shared/preview-map";
import { SearchAddressField } from "../../../../fields";
import { api, useMutation } from "api/eden";
import { EVENT_QUERY_KEY } from "@features/event/pages/details-page";
import { EVENT_ACTIONS_QUERY_KEY } from "../action-list/action-list";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { type Place } from "@features/event/types";
import { type Event } from "@features/event/types";
import { Value } from "@components/value";
import { makeAddressString } from "@features/event/utils";

interface UpdateAddressBody {
  address?: Place["address"];
  latitude: number;
  longitude: number;
}

interface Fields {
  place: AutocompleteOption<Place>;
}

const schema = yup.object<Fields>({
  place: yup.object().required(),
});

interface Props {
  event: Event;
  openRef: OpenRef;
}

const ChangeAddressDialog = ({ event, openRef }: Props) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation((body: UpdateAddressBody) =>
    api.events({ id: event.id }).updateAddress.patch(body),
  );

  const handleOnUpdate = (close: () => void) => async (data: Fields) => {
    const place = data.place.value;
    if (!place) {
      return;
    }

    mutate(
      {
        address: place.address,
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
      {
        onError: (err) =>
          toast.error(
            `Wystąpił błąd podczas aktualizacji adresu: ${(err as unknown as Error).message ?? "Nieznany błąd"}`,
          ),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [EVENT_QUERY_KEY, event.id],
          });
          queryClient.invalidateQueries({
            queryKey: [EVENT_ACTIONS_QUERY_KEY, event.id],
          });

          toast.success("Adres został zaktualizowany");
          close();
        },
      },
    );
  };

  return (
    <Dialog
      title="Zmień adres"
      description="Zmień adres wydarzenia"
      openRef={openRef}
    >
      {(close) => (
        <Form<Fields>
          onSubmit={handleOnUpdate(close)}
          resolver={yupResolver(schema as unknown as yup.ObjectSchema<object>)}
        >
          <section className="flex flex-col gap-2">
            <Value title="Aktualny adres">
              {makeAddressString(event.fullAddress)}
            </Value>
            <SearchAddressField name="place" label="Nowy adres" />
            <PreviewMap className="h-[24rem] md:h-[32rem] md:w-[32rem]" />
          </section>
          <section className="flex flex-row-reverse gap-2">
            <Button variant="primary" type="submit" disabled={isPending}>
              Aktualizuj
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

export { ChangeAddressDialog };

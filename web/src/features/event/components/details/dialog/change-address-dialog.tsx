import { AutocompleteOption } from "@components/autocomplete";
import { Button } from "@components/button";
import { Dialog, OpenRef } from "@components/dialog";
import { Form } from "@components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { PreviewMap } from "../../preview-map";
import { SearchAddressField } from "../../fields";
import {
  EVENT_ACTIONS_QUERY,
  EVENT_QUERY_KEY,
  useChangeEventAddressMutation,
} from "@features/event/api";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Place } from "types/place";
import { Event } from "types/event";
import { Value } from "@components/value";
import { makeAddressString } from "@features/event/utils";

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
  const { mutate, isPending } = useChangeEventAddressMutation();

  const handleOnUpdate = (close: () => void) => async (data: Fields) => {
    const place = data.place.value;
    if (!place) {
      return;
    }

    await mutate(
      {
        id: event.id,
        ...place,
      },
      {
        onError: (err) =>
          toast.error(
            `Wystąpił błąd podczas aktualizacji adresu: ${err.message}`
          ),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [EVENT_QUERY_KEY, event.id],
          });
          queryClient.invalidateQueries({
            queryKey: [EVENT_ACTIONS_QUERY, event.id],
          });

          toast.success("Adres został zaktualizowany");
          close();
        },
      }
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
          resolver={yupResolver(schema)}
        >
          <section className="flex flex-col gap-2">
            <Value title="Aktualny adres">
              {event?.address ?? makeAddressString(event.full_address)}
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

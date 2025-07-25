import {
  EVENT_ACTIONS_QUERY,
  EVENT_QUERY_KEY,
  useChangeEventStatusMutation,
} from "../../../api";
import { yup } from "@utils/yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Event, EventStatus } from "types/event";
import { getEventStatusText } from "@utils/event";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, OpenRef } from "@components/dialog";
import { ListboxOption } from "@components/listbox";
import { Form } from "@components/form";
import { ListboxField } from "@components/form/fields";
import { Button } from "@components/button";

const eventStatuses: EventStatus[] = ["APPROVED", "REJECTED"];

interface Fields {
  status: ListboxOption;
}

const schema = yup.object<Fields>({
  status: yup.mixed().required(),
});

interface Props {
  event: Event;
  openRef: OpenRef;
}

const ChangeStatusDialog = ({ event, openRef }: Props) => {
  const queryClient = useQueryClient();
  const { mutate: changeEventStatus, isPending } =
    useChangeEventStatusMutation();

  const handleOnSubmit = (close: () => void) => async (data: Fields) => {
    await changeEventStatus(
      {
        id: event.id,
        status: data.status.value as string,
      },
      {
        onSuccess: () => {
          close();
          toast.success("Zaktualizowano status wydarzenia");
          queryClient.invalidateQueries({
            queryKey: [EVENT_QUERY_KEY, event.id],
          });
          queryClient.invalidateQueries({
            queryKey: [EVENT_ACTIONS_QUERY, event.id],
          });
        },
      },
    );
  };

  return (
    <Dialog
      title="Zmień status"
      description="Zmień status wydarzenia"
      openRef={openRef}
    >
      {(close) => (
        <Form<Fields>
          onSubmit={handleOnSubmit(close)}
          resolver={yupResolver(schema)}
          defaultValues={{
            status: {
              id: event.status,
              label: getEventStatusText(event.status),
            },
          }}
        >
          <ListboxField
            name="status"
            label="Status wydarzenia"
            options={eventStatuses.map((status) => ({
              id: status,
              label: getEventStatusText(status),
              value: status,
            }))}
            isRequired
          />
          <section className="flex flex-row-reverse gap-2">
            <Button
              variant="primary"
              type="submit"
              isLoading={isPending}
              disabled={isPending}
            >
              Zaktualizuj
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

export { ChangeStatusDialog };

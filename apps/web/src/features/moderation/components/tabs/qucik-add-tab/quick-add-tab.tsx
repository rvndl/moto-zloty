import { Card } from "@components/card";
import { Form } from "@components/form";
import { Tabs } from "@components/tabs";

import { yup } from "@utils/yup";
import { api, useMutation } from "api/eden";
import toast from "react-hot-toast";
import { match } from "ts-pattern";
import { AIScrapTab, EventCreationTab } from "./tabs";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

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

  return (
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
          .with("Odczytywanie danych z plakatu", () => <AIScrapTab />)
          .exhaustive()}
      </Form>
    </Card>
  );
};

export { QuickAddTab };

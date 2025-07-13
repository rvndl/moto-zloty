import { useEventQuery } from "../api";
import {
  ChangeAddressDialog,
  ChangeStatusDialog,
  Details,
} from "../components";
import { useAuth } from "@features/auth";
import { useRouter } from "next/router";
import { EllipsisIcon } from "lucide-react";
import { useRef } from "react";
import { getFilePath } from "@utils/index";
import { Metadata } from "@components/metadata";
import { Page } from "@components/page";
import { Dropdown } from "@components/dropdown";
import { Button } from "@components/button";

const DetailsPage = () => {
  const {
    query: { id },
  } = useRouter();

  const { data: event, isLoading } = useEventQuery(id as string, {
    enabled: Boolean(id),
  });
  const { isPermitted, isOwner } = useAuth();
  const changeAddressOpenRef = useRef<(() => void) | null>(null);
  const changeStatusOpenRef = useRef<(() => void) | null>(null);

  return (
    <>
      <Metadata
        title={event?.name ?? ""}
        description={event?.description}
        canonical={`/wydarzenie/${id}`}
        structuredData={{
          headline: event?.name,
          datePublished: event?.created_at,
          image: getFilePath(event?.banner_small_id ?? event?.banner_id),
          author: {
            name: event?.account?.username,
            url: `/uzytkownik/${event?.account_id}`,
          },
        }}
      />
      <Page
        title={event?.name}
        breadcrumbs={[
          {
            label: `Wydarzenie: ${event?.name}`,
            isActive: true,
            isLoading,
          },
        ]}
        {...(event && {
          headerContent: (
            <Dropdown
              items={[
                {
                  label: "Zmień adres",
                  isHidden: !isOwner(event?.account_id) && !isPermitted,
                  onClick: () => changeAddressOpenRef.current?.(),
                },
                {
                  label: "Zmień status",
                  isHidden: !isPermitted,
                  onClick: () => changeStatusOpenRef.current?.(),
                },
              ]}
              trigger={
                <Button icon={<EllipsisIcon size={28} />} variant="ghost" />
              }
            />
          ),
        })}
      >
        <Details event={event} isLoading={isLoading} />
        {event && (
          <>
            <ChangeAddressDialog event={event} openRef={changeAddressOpenRef} />
            <ChangeStatusDialog event={event} openRef={changeStatusOpenRef} />
          </>
        )}
      </Page>
    </>
  );
};

export { DetailsPage };

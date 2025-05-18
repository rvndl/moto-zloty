import { Metadata, Page } from "@components";
import { useEffect } from "react";
import { EventsTab, AccountTab, SettingsTab } from "../components";
import { match } from "ts-pattern";
import { useAccountQuery } from "../api";
import { useAuth } from "@features/auth";
import { useRouter } from "next/router";
import { SettingsIcon, TicketIcon, UserIcon } from "lucide-react";

const AccountDetailsPage = () => {
  const {
    push,
    query: { id },
  } = useRouter();

  const { data, isLoading } = useAccountQuery(id as string, {
    enabled: Boolean(id),
  });
  const { isOwner } = useAuth();

  useEffect(() => {
    if (!id) {
      push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Metadata
        title={data?.username ?? ""}
        description={`Szczegóły użytkownika ${data?.username}`}
        canonical={`/account/${id}`}
      />
      <Page
        title={data?.username}
        breadcrumbs={[
          { label: `Szczegóły: ${data?.username}`, isActive: true, isLoading },
        ]}
        sidebarItems={[
          { label: "Szczegóły", icon: <UserIcon /> },
          { label: "Wydarzenia", icon: <TicketIcon /> },
          {
            label: "Ustawienia",
            icon: <SettingsIcon />,
            isHidden: !isOwner(id as string),
          },
        ]}
        isInline
      >
        {(tab) =>
          match(tab)
            .with("Szczegóły", () => <AccountTab account={data} />)
            .with("Wydarzenia", () => <EventsTab account={data} />)
            .with("Ustawienia", () => <SettingsTab />)
            .otherwise(() => null)
        }
      </Page>
    </>
  );
};

export { AccountDetailsPage };

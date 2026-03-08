import { useEffect } from "react";
import { EventsTab, AccountTab, SettingsTab } from "../components";
import { match } from "ts-pattern";
import { useAuth } from "@features/auth";
import { useRouter } from "next/router";
import { SettingsIcon, TicketIcon, UserIcon } from "lucide-react";
import { Metadata } from "@components/metadata";
import { Page } from "@components/page";
import { api, useQuery } from "api/eden";

export const ACCOUNT_QUERY_KEY = "ACCOUNT_QUERY_KEY";

const AccountDetailsPage = () => {
  const {
    push,
    query: { id },
  } = useRouter();

  const { data: account, isLoading } = useQuery(
    [ACCOUNT_QUERY_KEY, id],
    () => api.account({ id: id as string }).get(),
    {
      enabled: Boolean(id),
    },
  );

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
        title={account?.username ?? ""}
        description={`Szczegóły użytkownika ${account?.username}`}
        canonical={`/uzytkownik/${id}`}
      />
      <Page
        title={account?.username}
        breadcrumbs={[
          {
            label: `Szczegóły: ${account?.username}`,
            isActive: true,
            isLoading,
          },
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
            .with("Szczegóły", () => <AccountTab account={account} />)
            .with("Wydarzenia", () => <EventsTab account={account} />)
            .with("Ustawienia", () => <SettingsTab />)
            .otherwise(() => null)
        }
      </Page>
    </>
  );
};

export { AccountDetailsPage };

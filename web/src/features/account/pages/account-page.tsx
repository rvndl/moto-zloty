import { SettingsIcon, TicketIcon, UserIcon, Page } from "@components";
import { useEffect } from "react";
import { EventsTab, AccountTab, SettingsTab } from "../components";
import { match } from "ts-pattern";
import { useNavigate, useParams } from "react-router-dom";
import { useAccountQuery } from "../api";
import { useAuth } from "@features/auth";

const AccountPage = () => {
  const { id } = useParams();
  const { data } = useAccountQuery(id!, { enabled: Boolean(id) });
  const { isOwner } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      title={`${data?.username} - {TAB}`}
      breadcrumbs={[
        { to: "/", label: "Moto Zloty" },
        { label: `Profil: ${data?.username}`, isActive: true },
      ]}
      sidebarItems={[
        { label: "Profil", icon: <UserIcon /> },
        { label: "Wydarzenia", icon: <TicketIcon /> },
        {
          label: "Ustawienia",
          icon: <SettingsIcon />,
          isHidden: !isOwner(id),
        },
      ]}
      isInline
    >
      {(tab) =>
        match(tab)
          .with("Profil", () => <AccountTab account={data} />)
          .with("Wydarzenia", () => <EventsTab account={data} />)
          .with("Ustawienia", () => <SettingsTab />)
          .otherwise(() => null)
      }
    </Page>
  );
};

export { AccountPage };

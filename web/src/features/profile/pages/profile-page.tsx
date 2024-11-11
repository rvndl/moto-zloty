import { SettingsIcon, TicketIcon, UserIcon, Page } from "@components";
import { useEffect } from "react";
import { EventsTab, ProfileTab, SettingsTab } from "../components";
import { match } from "ts-pattern";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileQuery } from "../api";
import { useAuth } from "@features/auth";

const ProfilePage = () => {
  const { id } = useParams();
  const { data } = useProfileQuery(id!, { enabled: Boolean(id) });
  const { isOwner } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
    }
  }, []);

  return (
    <Page
      sidebarItems={[
        { label: "Profil", icon: <UserIcon /> },
        { label: "Wydarzenia", icon: <TicketIcon /> },
        {
          label: "Ustawienia",
          icon: <SettingsIcon />,
          isHidden: !isOwner(id),
        },
      ]}
    >
      {(tab) =>
        match(tab)
          .with("Profil", () => <ProfileTab account={data} />)
          .with("Wydarzenia", () => <EventsTab />)
          .with("Ustawienia", () => <SettingsTab />)
          .otherwise(() => null)
      }
    </Page>
  );
};

export { ProfilePage };

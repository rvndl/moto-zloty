import { SettingsIcon, TicketIcon, UserIcon } from "@components/icons";
import { useEffect, useState } from "react";
import { EventsTab, ProfileTab, SettingsTab, Sidebar } from "../components";
import { match } from "ts-pattern";
import { useNavigate, useParams } from "react-router-dom";
import { useProfileQuery } from "../api";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Profil");
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useProfileQuery(id!, { enabled: Boolean(id) });

  useEffect(() => {
    if (!id) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex w-full h-full gap-4">
      <section className="w-52">
        <Sidebar
          items={[
            { label: "Profil", icon: <UserIcon /> },
            { label: "Wydarzenia", icon: <TicketIcon /> },
            { label: "Ustawienia", icon: <SettingsIcon /> },
          ]}
          onChange={(tab) => setActiveTab(tab)}
        />
      </section>
      <section className="flex-1">
        {match(activeTab)
          .with("Profil", () => <ProfileTab account={data} />)
          .with("Wydarzenia", () => <EventsTab />)
          .with("Ustawienia", () => <SettingsTab />)
          .otherwise(() => null)}
      </section>
    </div>
  );
};

export { ProfilePage };

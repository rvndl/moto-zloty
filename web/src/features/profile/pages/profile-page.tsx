import { SettingsIcon, TicketIcon, UserIcon } from "@components/icons";
import { useState } from "react";
import { EventsTab, ProfileTab, SettingsTab, Sidebar } from "../components";
import { match } from "ts-pattern";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Profil");

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
          .with("Profil", () => <ProfileTab />)
          .with("Wydarzenia", () => <EventsTab />)
          .with("Ustawienia", () => <SettingsTab />)
          .otherwise(() => null)}
      </section>
    </div>
  );
};

export { ProfilePage };

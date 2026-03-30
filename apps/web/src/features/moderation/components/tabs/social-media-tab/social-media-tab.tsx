import { useState } from "react";
import { FileTextIcon, ImageIcon } from "lucide-react";
import { FacebookPost, InstagramCarousel } from "./cards";
import { SocialMenuCard } from "./cards/social-menu-card";

type SocialCardKey = "facebook" | "instagram";

const SocialMediaTab = () => {
  const [activeCard, setActiveCard] = useState<SocialCardKey>("instagram");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <SocialMenuCard
          title="Facebook post"
          description="Krótki post z listą wydarzeń na wybrany tydzień."
          icon={<FileTextIcon />}
          badge="Copy-ready"
          isActive={activeCard === "facebook"}
          onClick={() => setActiveCard("facebook")}
        />
        <SocialMenuCard
          title="Instagram carousel"
          description="Generator slajdów i publikacja karuzeli z podziałem na województwa."
          icon={<ImageIcon />}
          badge="Nowe"
          isActive={activeCard === "instagram"}
          onClick={() => setActiveCard("instagram")}
        />
      </div>

      {activeCard === "facebook" ? <FacebookPost /> : <InstagramCarousel />}
    </div>
  );
};

export { SocialMediaTab };

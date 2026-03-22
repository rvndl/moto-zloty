import { useAuth } from "@features/auth";
import { useEffect } from "react";
import { match } from "ts-pattern";
import {
  DashboardTab,
  EventListTab,
  QuickAddTab,
  SocialMediaTab,
  UserListTab,
} from "../components";
import { useRouter } from "next/navigation";
import {
  ChartAreaIcon,
  BookUserIcon,
  ShieldCheckIcon,
  SparklesIcon,
  GlobeIcon,
} from "lucide-react";
import { Page } from "@components/page";

const ModerationPage = () => {
  const { isPermitted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPermitted) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPermitted]);

  return (
    <Page
      title="Moderacja"
      breadcrumbs={[{ label: "Moderacja", isActive: true }]}
      sidebarItems={[
        { label: "Dashboard", icon: <ChartAreaIcon /> },
        { label: "Użytkownicy", icon: <BookUserIcon /> },
        { label: "Wydarzenia", icon: <ShieldCheckIcon /> },
        { label: "Szybkie dodawanie", icon: <SparklesIcon /> },
        { label: "Social media", icon: <GlobeIcon /> },
      ]}
      isInline
    >
      {(tab) =>
        match(tab)
          .with("Dashboard", () => <DashboardTab />)
          .with("Użytkownicy", () => <UserListTab />)
          .with("Wydarzenia", () => <EventListTab />)
          .with("Szybkie dodawanie", () => <QuickAddTab />)
          .with("Social media", () => <SocialMediaTab />)
          .otherwise(() => null)
      }
    </Page>
  );
};

export { ModerationPage };

import { useAuth } from "@features/auth";
import { useEffect } from "react";
import { match } from "ts-pattern";
import {
  EventListTab,
  QuickAddTab,
  StatisticsTab,
  UserListTab,
} from "../components";
import { useRouter } from "next/navigation";
import {
  ChartAreaIcon,
  BookUserIcon,
  ShieldCheckIcon,
  SparklesIcon,
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
        { label: "Statystyki", icon: <ChartAreaIcon /> },
        { label: "Użytkownicy", icon: <BookUserIcon /> },
        { label: "Wydarzenia", icon: <ShieldCheckIcon /> },
        { label: "Szybkie dodawanie", icon: <SparklesIcon /> },
      ]}
      isInline
    >
      {(tab) =>
        match(tab)
          .with("Statystyki", () => <StatisticsTab />)
          .with("Użytkownicy", () => <UserListTab />)
          .with("Wydarzenia", () => <EventListTab />)
          .with("Szybkie dodawanie", () => <QuickAddTab />)
          .otherwise(() => null)
      }
    </Page>
  );
};

export { ModerationPage };

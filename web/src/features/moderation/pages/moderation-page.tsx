import {
  ChartAreaIcon,
  ShieldCheckIcon,
  UserBookIcon,
} from "@components/icons";
import { Page } from "@components/page";
import { useAuth } from "@features/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { EventListTab, StatisticsTab, UserListTab } from "../components";

const ModerationPage = () => {
  const { isPermitted } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPermitted) {
      navigate("/");
    }
  }, [isPermitted]);

  return (
    <Page
      title="Moderacja - {TAB}"
      breadcrumbs={[
        { to: "/", label: "Moto Zloty" },
        { label: "Moderacja", isActive: true },
      ]}
      sidebarItems={[
        { label: "Statystyki", icon: <ChartAreaIcon /> },
        { label: "Użytkownicy", icon: <UserBookIcon /> },
        { label: "Wydarzenia", icon: <ShieldCheckIcon /> },
      ]}
      isInline
    >
      {(tab) =>
        match(tab)
          .with("Statystyki", () => <StatisticsTab />)
          .with("Użytkownicy", () => <UserListTab />)
          .with("Wydarzenia", () => <EventListTab />)
          .otherwise(() => null)
      }
    </Page>
  );
};

export { ModerationPage };

import { Button } from "@components/button";
import { EventSearch } from "@features/event";
import { transitionSpring } from "@utils/transition";
import { AnimatePresence, m } from "framer-motion";
import { isEmpty } from "lodash";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "./user-menu";
import { UserState } from "@features/auth";
import { useRouter } from "next/router";

interface Props {
  user: UserState;
  isFloating: boolean;
  onLogout: () => void;
}

const DesktopMenu = ({ user, isFloating, onLogout }: Props) => {
  const router = useRouter();

  const handleOnLoginClick = () => {
    router.push("/logowanie");
  };

  return (
    <div className="absolute inset-y-0 right-0 items-center gap-2 pr-2 md:gap-4 sm:static sm:inset-auto sm:ml-6 sm:pr-0 hidden sm:flex">
      <AnimatePresence mode="popLayout">
        {!isFloating && (
          <m.div
            key="add-event"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
            transition={{ ...transitionSpring, opacity: { duration: 0.2 } }}
          >
            <Link href={isEmpty(user) ? "/logowanie" : "/wydarzenie/stworz"}>
              <Button
                variant="outline"
                icon={<PlusIcon />}
                title="Dodaj wydarzenie"
              >
                Dodaj wydarzenie
              </Button>
            </Link>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {!isFloating && (
          <m.div
            key="divider"
            className="border-l w-px h-8 py-2 opacity-10 border-muted"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 0.1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ ...transitionSpring, opacity: { duration: 0.15 } }}
          >
            &nbsp;
          </m.div>
        )}
      </AnimatePresence>

      <EventSearch />

      {isEmpty(user) ? (
        <Button
          variant="ghost"
          title="Zaloguj się"
          onClick={handleOnLoginClick}
        >
          Zaloguj się
        </Button>
      ) : (
        <UserMenu user={user} onLogout={onLogout} />
      )}
    </div>
  );
};

export { DesktopMenu };

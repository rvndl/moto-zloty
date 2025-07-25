import { Button } from "@components/button";
import { AnimatePresence, motion } from "framer-motion";
import { LogOutIcon, MenuIcon, UserIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Route } from "./navbar";
import { NavbarItem } from "./navbar-item";
import { EventSearch } from "@features/event";
import { UserState } from "@features/auth";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/navigation";
import { rankToString } from "@utils/user";

interface Props {
  routes: Route[];
  user: UserState;
  pathname: string;
  onLogout: () => void;
  isPermitted?: boolean;
}

const MobileMenu = ({
  routes,
  user,
  isPermitted,
  pathname,
  onLogout,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="sm:hidden flex items-center gap-2">
      <EventSearch />
      <Button
        variant="ghost"
        icon={<MenuIcon size={28} />}
        onClick={() => setIsOpen(true)}
      />
      {typeof window === "object" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  className="fixed h-screen w-screen bg-white backdrop-blur z-50 shadow top-0 bottom-0 left-0 right-0 p-4 flex flex-col"
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 200 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    className="ml-auto"
                    variant="ghost"
                    icon={<XIcon size={32} />}
                    onClick={() => setIsOpen(false)}
                  />
                  <ol className="w-full flex flex-col space-y-0.5 mt-4">
                    {routes.map((route) => {
                      if (route.isProtected && !isPermitted) return null;

                      return (
                        <NavbarItem
                          key={route.name}
                          to={route.path}
                          icon={route.icon}
                          isActive={
                            route.isParentPath
                              ? pathname.includes(route.path)
                              : pathname === route.path
                          }
                          isMobile
                          onChange={() => setIsOpen(false)}
                        >
                          {route.name}
                        </NavbarItem>
                      );
                    })}
                  </ol>
                  <hr className="my-4" />
                  <div className="w-full">
                    {isEmpty(user) ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => router.push("/logowanie")}
                      >
                        Zaloguj się
                      </Button>
                    ) : (
                      <>
                        <div className="leading-tight">
                          <p className="font-semibold text-black">
                            {user.username}
                          </p>
                          <p className="text-xs text-black text-opacity-70 font-medium">
                            {rankToString(user.rank)}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 w-full gap-2 mt-4">
                          <Button
                            variant="outline"
                            textAlignment="left"
                            icon={<UserIcon />}
                            onClick={() => {
                              router.push(`/uzytkownik/${user.id}`);
                              setIsOpen(false);
                            }}
                          >
                            Profil
                          </Button>
                          <Button
                            variant="outline"
                            textAlignment="left"
                            icon={<LogOutIcon />}
                            onClick={() => {
                              onLogout();
                              setIsOpen(false);
                            }}
                          >
                            Wyloguj
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
};
export { MobileMenu };

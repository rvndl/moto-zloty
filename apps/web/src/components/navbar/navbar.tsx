import { useAuth } from "@features/auth";
import { NavbarItem } from "./navbar-item";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@components/button";
import { MobileMenu } from "./mobile-menu";
import { CogIcon, ListIcon, MapIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { m, LayoutGroup } from "framer-motion";
import { Brand } from "./brand";
import { transitionInstant, transitionSpring } from "@utils/transition";
import { DesktopMenu } from "./desktop-menu";
import {
  formatStateName,
  getStateAssociatedIcon,
  states,
} from "@features/event/utils";

const SCROLL_THRESHOLD = 50;

interface Route {
  name: string;
  path: string;
  icon?: ReactNode;
  isParentPath?: boolean;
  isProtected?: boolean;
  items?: {
    name: string;
    path: string;
    icon?: ReactNode;
    separated?: boolean;
  }[];
}

const eventListItems = [
  ...states.map((state) => ({
    name: formatStateName(state),
    path: `/lista-wydarzen/${encodeURIComponent(state)}`,
    icon: getStateAssociatedIcon(state),
  })),
  {
    name: "Archiwum 2025",
    path: "/lista-wydarzen/2025",
    separated: true,
  },
];

const routes: Route[] = [
  {
    name: "Mapa",
    path: "/mapa",
    icon: <MapIcon />,
  },
  {
    name: "Lista wydarzeń",
    path: "/lista-wydarzen",
    isParentPath: true,
    icon: <ListIcon />,
    items: eventListItems,
  },
  {
    name: "Moderacja",
    path: "/moderation",
    isProtected: true,
    icon: <CogIcon />,
  },
];

const Navbar = () => {
  const [isFloating, setIsFloating] = useState(false);
  const hasMounted = useRef(false);

  const { user, logout, isPermitted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    requestAnimationFrame(() => {
      hasMounted.current = true;
    });

    const handleScroll = () => {
      setIsFloating(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOnLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <LayoutGroup>
      <m.nav
        role="navigation"
        layout
        className="sticky top-0 z-50"
        transition={hasMounted.current ? transitionSpring : transitionInstant}
        initial={false}
        animate={{ padding: isFloating ? "0.5rem 1rem" : "0rem" }}
      >
        <m.div
          layout
          className={clsx(
            "border",
            isFloating
              ? "bg-white/80 backdrop-blur-xl border-gray-200/60 rounded-full shadow-lg shadow-black/[0.08] mx-auto w-fit"
              : "bg-white border-gray-100 rounded-md shadow-sm",
          )}
          transition={hasMounted.current ? transitionSpring : transitionInstant}
        >
          <m.div
            layout
            className={clsx(
              "mx-auto",
              isFloating ? "px-5" : "px-4 max-w-7xl sm:px-6 lg:px-8",
            )}
            transition={
              hasMounted.current ? transitionSpring : transitionInstant
            }
          >
            <m.div
              layout
              className="relative flex items-center justify-between"
              initial={false}
              animate={{ height: isFloating ? 48 : 64 }}
              transition={
                hasMounted.current ? transitionSpring : transitionInstant
              }
            >
              <div className="flex items-center flex-1 sm:items-stretch sm:justify-start">
                <Brand
                  isFloating={isFloating}
                  hasMounted={hasMounted.current}
                />

                <div className="hidden sm:ml-6 sm:block">
                  <ol className="flex space-x-4 items-center">
                    {routes.map((route) => {
                      if (route.isProtected && !isPermitted) {
                        return null;
                      }

                      const isActive = route.isParentPath
                        ? pathname?.includes(route.path)
                        : pathname === route.path;

                      if (route.items?.length) {
                        return (
                          <li key={route.name} className="relative group">
                            <NavbarItem
                              to={route.path}
                              title={route.name}
                              isActive={isActive}
                              asListItem={false}
                            >
                              {route.name}
                            </NavbarItem>

                            <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible translate-y-1 transition-all duration-150 ease-out pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                              <ol className="grid w-[min(32rem,calc(100vw-2rem))] grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-lg shadow-black/[0.08]">
                                {route.items.map((item) => (
                                  <li
                                    key={item.path}
                                    className={clsx(
                                      item.separated &&
                                        "col-span-full mt-1 border-t border-gray-200 pt-2",
                                    )}
                                  >
                                    <Link href={item.path} title={item.name}>
                                      <Button
                                        variant={
                                          pathname === item.path
                                            ? "primary"
                                            : "ghost"
                                        }
                                        icon={item.icon}
                                        className="w-full"
                                        textAlignment="left"
                                      >
                                        {item.name}
                                      </Button>
                                    </Link>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </li>
                        );
                      }

                      return (
                        <NavbarItem
                          key={route.name}
                          to={route.path}
                          title={route.name}
                          isActive={isActive}
                        >
                          {route.name}
                        </NavbarItem>
                      );
                    })}
                  </ol>
                </div>
              </div>

              {/* Desktop menu */}
              <DesktopMenu
                user={user}
                isFloating={isFloating}
                onLogout={handleOnLogout}
              />

              {/* Mobile menu */}
              <MobileMenu
                routes={routes}
                user={user}
                pathname={pathname}
                isPermitted={!!isPermitted}
                onLogout={handleOnLogout}
              />
            </m.div>
          </m.div>
        </m.div>
      </m.nav>
    </LayoutGroup>
  );
};

export { Navbar, type Route };

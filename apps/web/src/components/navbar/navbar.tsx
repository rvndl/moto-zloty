import { useAuth } from "@features/auth";
import { NavbarItem } from "./navbar-item";
import Logo from "@assets/img/mz-logo-black.png";
import isEmpty from "lodash/isEmpty";
import { UserMenu } from "./user-menu";
import { usePathname, useRouter } from "next/navigation";
import { EventSearch } from "@features/event";
import Image from "next/image";
import { Button } from "@components/button";
import { MobileMenu } from "./mobile-menu";
import { CogIcon, ListIcon, MapIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";

const SCROLL_THRESHOLD = 50;

const spring = {
  type: "spring",
  stiffness: 350,
  damping: 30,
  mass: 0.8,
} as const;

const instant = { duration: 0 } as const;

interface Route {
  name: string;
  path: string;
  icon?: ReactNode;
  isParentPath?: boolean;
  isProtected?: boolean;
  items?: Pick<Route, "name" | "path">[];
}

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
    items: [
      {
        name: "Lista wydarzeń 2025",
        path: "/lista-wydarzen/2025",
      },
    ],
  },
  {
    name: "Moderacja",
    path: "/moderation",
    isProtected: true,
    icon: <CogIcon />,
  },
];

const Navbar = () => {
  const { user, logout, isPermitted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isFloating, setIsFloating] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    // Skip animations on initial load by deferring the mount flag
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
      <motion.nav
        layout
        className="sticky top-0 z-50"
        transition={hasMounted.current ? spring : instant}
        initial={false}
        animate={{ padding: isFloating ? "0.5rem 1rem" : "0rem" }}
      >
        <motion.div
          layout
          className={clsx(
            "border",
            isFloating
              ? "bg-white/80 backdrop-blur-xl border-gray-200/60 rounded-full shadow-lg shadow-black/[0.08] mx-auto w-fit"
              : "bg-white border-gray-100 rounded-md shadow-sm",
          )}
          transition={hasMounted.current ? spring : instant}
        >
          <motion.div
            layout
            className={clsx(
              "mx-auto",
              isFloating ? "px-5" : "px-4 max-w-7xl sm:px-6 lg:px-8",
            )}
            transition={hasMounted.current ? spring : instant}
          >
            <motion.div
              layout
              className="relative flex items-center justify-between"
              initial={false}
              animate={{ height: isFloating ? 48 : 64 }}
              transition={hasMounted.current ? spring : instant}
            >
              <div className="flex items-center flex-1 sm:items-stretch sm:justify-start">
                <motion.div
                  layout="position"
                  className="flex items-center flex-shrink-0"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      height: isFloating ? 16 : 20,
                    }}
                    transition={hasMounted.current ? spring : instant}
                  >
                    <Image
                      className="w-auto h-full cursor-pointer"
                      src={Logo.src}
                      alt="Moto Zloty"
                      title="Moto Zloty"
                      onClick={() => router.push("/")}
                      width={512}
                      height={203}
                    />
                  </motion.div>
                </motion.div>
                <div className="hidden sm:ml-6 sm:block">
                  <ol className="flex space-x-4 items-center">
                    {routes.map((route) => {
                      if (route.isProtected && !isPermitted) {
                        return null;
                      }

                      const isActive = route.isParentPath
                        ? pathname.includes(route.path)
                        : pathname === route.path;

                      if (route.items?.length) {
                        return (
                          <li key={route.name} className="relative group">
                            <NavbarItem
                              to={route.path}
                              title={route.name}
                              isActive={isActive}
                            >
                              {route.name}
                            </NavbarItem>

                            <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible translate-y-1 transition-all duration-150 ease-out pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto">
                              <ol className="min-w-max rounded-xl border border-gray-200 bg-white p-2 shadow-lg shadow-black/[0.08]">
                                {route.items.map((item) => (
                                  <li key={item.path}>
                                    <Link href={item.path} title={item.name}>
                                      <Button
                                        variant={
                                          pathname === item.path
                                            ? "primary"
                                            : "ghost"
                                        }
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
              <div className="absolute inset-y-0 right-0 items-center gap-2 pr-2 md:gap-4 sm:static sm:inset-auto sm:ml-6 sm:pr-0 hidden sm:flex">
                <AnimatePresence mode="popLayout">
                  {!isFloating && (
                    <motion.div
                      key="add-event"
                      initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                      transition={{ ...spring, opacity: { duration: 0.2 } }}
                    >
                      <Link
                        href={
                          isEmpty(user) ? "/logowanie" : "/wydarzenie/stworz"
                        }
                      >
                        <Button
                          variant="outline"
                          icon={<PlusIcon />}
                          title="Dodaj wydarzenie"
                        >
                          Dodaj wydarzenie
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {!isFloating && (
                    <motion.div
                      key="divider"
                      className="border-l w-px h-8 py-2 opacity-10 border-muted"
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 0.1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ ...spring, opacity: { duration: 0.15 } }}
                    >
                      &nbsp;
                    </motion.div>
                  )}
                </AnimatePresence>

                <EventSearch />

                {isEmpty(user) ? (
                  <Button
                    variant="ghost"
                    onClick={() => router.push("/logowanie")}
                    title="Zaloguj się"
                  >
                    Zaloguj się
                  </Button>
                ) : (
                  <UserMenu user={user} logout={handleOnLogout} />
                )}
              </div>

              {/* Mobile menu */}
              <MobileMenu
                routes={routes}
                user={user}
                pathname={pathname}
                isPermitted={!!isPermitted}
                onLogout={handleOnLogout}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.nav>
    </LayoutGroup>
  );
};

export { Navbar, type Route };

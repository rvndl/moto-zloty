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
import { CogIcon, ListIcon, MapIcon } from "lucide-react";

interface Route {
  name: string;
  path: string;
  icon?: React.ReactNode;
  isParentPath?: boolean;
  isProtected?: boolean;
}

const routes: Route[] = [
  { name: "Mapa wydarzeń", path: "/", icon: <MapIcon /> },
  {
    name: "Lista wydarzeń",
    path: "/lista-wydarzen",
    isParentPath: true,
    icon: <ListIcon />,
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

  const handleOnLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav>
      <div className="bg-white border border-gray-100 rounded-md shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center flex-1 sm:items-stretch sm:justify-start">
              <div className="flex items-center flex-shrink-0">
                <Image
                  className="w-auto h-5 cursor-pointer"
                  src={Logo.src}
                  alt="Moto Zloty"
                  title="Moto Zloty"
                  onClick={() => router.push("/")}
                  width={512}
                  height={203}
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <ol className="flex space-x-4">
                  {routes.map((route) => {
                    if (route.isProtected && !isPermitted) return null;

                    return (
                      <NavbarItem
                        key={route.name}
                        to={route.path}
                        isActive={
                          route.isParentPath
                            ? pathname.includes(route.path)
                            : pathname === route.path
                        }
                      >
                        {route.name}
                      </NavbarItem>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Desktop menu */}
            <div className="absolute inset-y-0 right-0 items-center gap-2 pr-2 md:gap-8 sm:static sm:inset-auto sm:ml-6 sm:pr-0 hidden sm:flex">
              <EventSearch />
              {isEmpty(user) ? (
                <Button
                  variant="ghost"
                  onClick={() => router.push("/logowanie")}
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
              isPermitted={isPermitted}
              onLogout={handleOnLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar, type Route };

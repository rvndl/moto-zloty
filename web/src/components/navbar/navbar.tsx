import { LoginDialog, useAuth } from "@features/auth";
import { NavbarItem } from "./navbar-item";
import Logo from "@assets/img/mz-logo-black.png";
import { isEmpty } from "lodash";
import { UserMenu } from "./user-menu";
import { usePathname, useRouter } from "next/navigation";
import { EventSearch } from "@features/event";
import Image from "next/image";

const routes = [
  { name: "Mapa wydarzeń", path: "/" },
  { name: "Lista wydarzeń", path: "/lista-wydarzen", isParentPath: true },
  { name: "Moderacja", path: "/moderation", isProtected: true },
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
    <nav className="pb-4">
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
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 md:gap-8 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <EventSearch />
              {isEmpty(user) ? (
                <LoginDialog />
              ) : (
                <UserMenu user={user} logout={handleOnLogout} />
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export { Navbar };

import { LoginDialog, useAuth } from "@features/auth";
import { NavbarItem } from "./navbar-item";
import Logo from "@assets/img/mz-logo-black.png";
import { isEmpty } from "lodash";
import { UserMenu } from "./user-menu";
import { usePathname, useRouter } from "next/navigation";

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
        <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
              <div className="flex items-center flex-shrink-0">
                <img
                  className="w-auto h-5 cursor-pointer"
                  src={Logo.src}
                  alt="Moto Zloty"
                  onClick={() => router.push("/")}
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <NavbarItem to="/" isActive={pathname === "/"}>
                    Wydarzenia
                  </NavbarItem>
                  {isPermitted && (
                    <NavbarItem
                      to="/moderation"
                      isActive={pathname === "/moderation"}
                    >
                      Moderacja
                    </NavbarItem>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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

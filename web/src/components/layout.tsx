import { PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Geist } from "next/font/google";
import clsx from "clsx";
import ListByState from "@features/event/components/list-by-state/list-by-state";
import { usePathname } from "next/navigation";

const geist = Geist({ subsets: ["latin"] });

const WITHOUT_CONTAINER_PAGES = ["/logowanie", "/rejestracja"];
const FULL_WIDTH_PAGES = ["/wydarzenie"];

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isListByStateVisible = pathname === "/";
  const isFullWidthPage = FULL_WIDTH_PAGES.some((path) =>
    pathname.includes(path),
  );

  if (WITHOUT_CONTAINER_PAGES.includes(pathname)) {
    return children;
  }

  return (
    <div className={clsx("w-screen h-screen", geist.className)}>
      <div className="flex flex-col w-full h-full">
        <Navbar />
        <div className="flex flex-col w-full h-full overflow-x-hidden">
          <div
            className={clsx(
              "w-full mx-auto mb-0 md:mb-4",
              !isFullWidthPage && "max-w-7xl sm:px-6 lg:px-8",
            )}
          >
            {children}
          </div>
          {isListByStateVisible && <ListByState />}
          <Footer variant={isListByStateVisible ? "dark" : "light"} />
        </div>
      </div>
    </div>
  );
};

export { Layout };

import { PropsWithChildren, useMemo } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Geist } from "next/font/google";
import clsx from "clsx";
import { ListByState } from "@features/event/components/state-list";
import { usePathname } from "next/navigation";

const geist = Geist({ subsets: ["latin"] });

interface PageDefinition {
  url: string;
  ignore?: string[];
}

const WITHOUT_CONTAINER_PAGES = ["/logowanie", "/rejestracja"];
const FULL_WIDTH_PAGES: PageDefinition[] = [
  {
    url: "/wydarzenie",
    ignore: ["/wydarzenie/stworz"],
  },
];

const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isListByStateVisible = pathname === "/";

  const isFullWidthPage = useMemo(
    () =>
      FULL_WIDTH_PAGES.some((page) => {
        const includes = pathname.includes(page.url);
        if (includes) {
          const isIgnored = page.ignore?.includes(pathname);
          return !isIgnored;
        }

        return pathname.includes(page.url);
      }),
    [pathname],
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

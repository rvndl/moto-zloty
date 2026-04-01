import { PropsWithChildren, useMemo } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Geist } from "next/font/google";
import clsx from "clsx";
import { ListByState } from "@features/event/components/state-list";
import { usePathname } from "next/navigation";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("framer-motion").then((mod) => mod.domMax);

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
        if (!pathname) {
          return false;
        }

        const includes = pathname.includes(page.url);
        if (includes) {
          const isIgnored = page.ignore?.includes(pathname);
          return !isIgnored;
        }

        return pathname.includes(page.url);
      }),
    [pathname],
  );

  if (WITHOUT_CONTAINER_PAGES.includes(pathname || "")) {
    return children;
  }

  return (
    <LazyMotion features={loadFeatures}>
      <div className={clsx("w-full min-h-screen", geist.className)}>
        <Navbar />
        <div className="flex flex-col w-full overflow-x-hidden">
          <main
            role="main"
            className={clsx(
              "w-full mx-auto mb-0 md:mb-4",
              !isFullWidthPage && "max-w-7xl sm:px-6 lg:px-8",
            )}
          >
            {children}
          </main>
          {isListByStateVisible && <ListByState />}
          <Footer variant={isListByStateVisible ? "dark" : "light"} />
        </div>
      </div>
    </LazyMotion>
  );
};

export { Layout };

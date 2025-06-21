import { PropsWithChildren } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Geist } from "next/font/google";
import clsx from "clsx";

const geist = Geist({ subsets: ["latin"] });

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className={clsx("w-screen h-screen", geist.className)}>
      <div className="flex flex-col w-full h-full">
        <Navbar />
        <div className="flex flex-col w-full h-full overflow-x-hidden">
          <div className="w-full mx-auto mb-0 md:mb-4 max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export { Layout };

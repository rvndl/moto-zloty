import { PropsWithChildren } from "react";
import { Navbar } from "./navbar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-screen h-screen">
      <div className="flex flex-col w-full h-full">
        <Navbar />
        <div className="flex w-full h-full overflow-x-hidden">
          <div className="w-full mx-auto mb-0 md:mb-4 max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Layout };

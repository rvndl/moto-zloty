import clsx from "clsx";
import { PropsWithChildren } from "react";

interface Props {
  isActive?: boolean;
}

const NavbarItem = ({ isActive, children }: PropsWithChildren<Props>) => {
  return (
    <a
      className={clsx(
        "px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
        isActive
          ? "text-white bg-gray-900"
          : "text-gray-800 hover:bg-gray-900 hover:text-white"
      )}
      aria-current="page"
    >
      {children}
    </a>
  );
};

export { NavbarItem };

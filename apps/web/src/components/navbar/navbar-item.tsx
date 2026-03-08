import { Button } from "@components/button";
import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props {
  to: string;
  title?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isMobile?: boolean;
  onChange?: () => void;
}

const NavbarItem = ({
  to,
  title,
  icon,
  isActive,
  isMobile,
  children,
  onChange,
}: PropsWithChildren<Props>) => {
  return (
    <li className={clsx(isMobile && "w-full")}>
      <Link href={to} title={title}>
        <Button
          variant={isActive ? "primary" : "ghost"}
          className={clsx(isMobile && "w-full")}
          textAlignment={isMobile ? "left" : "center"}
          icon={icon}
          onClick={onChange}
        >
          {children}
        </Button>
      </Link>
    </li>
  );
};

export { NavbarItem };

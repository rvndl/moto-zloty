import { Button } from "@components/button";
import clsx from "clsx";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { m } from "framer-motion";

interface Props {
  to: string;
  title?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  isMobile?: boolean;
  asListItem?: boolean;
  onChange?: () => void;
}

const NavbarItem = ({
  to,
  title,
  icon,
  isActive,
  isMobile,
  asListItem = true,
  children,
  onChange,
}: PropsWithChildren<Props>) => {
  const content = (
    <>
      {isActive && !isMobile && (
        <m.div
          layoutId="navbar-active-indicator"
          className="absolute inset-0 rounded-lg bg-primary/10"
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}

      <Link href={to} title={title}>
        <Button
          variant={isActive ? "primary" : "ghost"}
          className={clsx("relative z-10", isMobile && "w-full")}
          textAlignment={isMobile ? "left" : "center"}
          icon={icon}
          onClick={onChange}
        >
          {children}
        </Button>
      </Link>
    </>
  );

  if (!asListItem) {
    return content;
  }

  return <li className={clsx("relative", isMobile && "w-full")}>{content}</li>;
};

export { NavbarItem };

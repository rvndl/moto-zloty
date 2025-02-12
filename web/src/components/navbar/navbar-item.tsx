import { Button } from "@components";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props {
  to: string;
  isActive?: boolean;
}

const NavbarItem = ({ to, isActive, children }: PropsWithChildren<Props>) => {
  return (
    <Link href={to}>
      <Button variant={isActive ? "primary" : "ghost"}>{children}</Button>
    </Link>
  );
};

export { NavbarItem };

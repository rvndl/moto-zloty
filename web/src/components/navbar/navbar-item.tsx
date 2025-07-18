import { Button } from "@components/button";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface Props {
  to: string;
  isActive?: boolean;
}

const NavbarItem = ({ to, isActive, children }: PropsWithChildren<Props>) => {
  return (
    <li>
      <Link href={to}>
        <Button variant={isActive ? "primary" : "ghost"}>{children}</Button>
      </Link>
    </li>
  );
};

export { NavbarItem };

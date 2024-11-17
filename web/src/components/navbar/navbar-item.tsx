import { Button } from "@components/button";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

interface Props {
  to: string;
  isActive?: boolean;
}

const NavbarItem = ({ to, isActive, children }: PropsWithChildren<Props>) => {
  return (
    <Link to={to}>
      <Button variant={isActive ? "primary" : "ghost"}>{children}</Button>
    </Link>
  );
};

export { NavbarItem };

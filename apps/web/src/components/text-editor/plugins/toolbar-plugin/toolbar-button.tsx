import { Button, ButtonProps } from "@components/button";

interface ToolbarButtonProps extends ButtonProps {
  isActive?: boolean;
}

const ToolbarButton = ({ isActive, ...rest }: ToolbarButtonProps) => (
  <Button
    variant={isActive ? "primary" : "ghost"}
    className="p-0 h-7"
    type="button"
    {...rest}
  />
);

export { ToolbarButton };

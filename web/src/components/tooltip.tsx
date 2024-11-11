import { ComponentProps } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Tooltip = (props: ComponentProps<typeof ReactTooltip>) => {
  return (
    <ReactTooltip
      style={{
        background: "white",
        color: "black",
        padding: "0.5rem",
        borderRadius: "0.375rem",
      }}
      border="1px solid #e5e7eb"
      {...props}
    />
  );
};

export { Tooltip };

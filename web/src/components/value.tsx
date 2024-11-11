import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { Label } from "./label";
import { HelpText } from "./help-text";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  helpText?: string | ReactNode;
}

const Value = ({
  title,
  helpText,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col gap-1 text-sm" {...rest}>
      <Label>{title}</Label>
      {children}
      {Boolean(helpText) && <HelpText size="xs">{helpText}</HelpText>}
    </div>
  );
};

export { Value };

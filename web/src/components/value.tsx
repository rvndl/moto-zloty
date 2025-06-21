import { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { Label } from "./label";
import { HelpText } from "./help-text";
import { Skeleton } from "./skeleton";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  helpText?: string | ReactNode;
  isLoading?: boolean;
}

const Value = ({
  title,
  helpText,
  isLoading,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col gap-1 text-sm" {...rest}>
      <Label>{title}</Label>
      {isLoading ? <Skeleton className="w-32 h-4" /> : children}
      {Boolean(helpText) && <HelpText size="xs">{helpText}</HelpText>}
    </div>
  );
};

export { Value };

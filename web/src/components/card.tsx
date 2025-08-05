import {
  ElementType,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  contentClassName?: string;
  titleAs?: ElementType;
  titleWrapper?: (titleElement: ReactNode) => ReactNode;
}

const Card = ({
  title,
  description,
  children,
  className,
  contentClassName,
  titleAs = "p",
  titleWrapper,
  ...rest
}: PropsWithChildren<Props>) => {
  const Title = titleAs;

  return (
    <div
      className={twMerge(
        "p-4 md:p-6 rounded-xl border bg-card bg-white shadow-sm",
        className,
      )}
      {...rest}
    >
      {Boolean(title) && (
        <div className="flex flex-col space-y-1.5">
          {titleWrapper ? (
            titleWrapper(
              <Title className="font-semibold leading-none tracking-tight">
                {title}
              </Title>,
            )
          ) : (
            <Title className="font-semibold leading-none tracking-tight">
              {title}
            </Title>
          )}
          {Boolean(description) && (
            <span className="text-sm text-muted">{description}</span>
          )}
        </div>
      )}
      <div className={twMerge(Boolean(title) && "mt-6", contentClassName)}>
        {children}
      </div>
    </div>
  );
};

export { Card };

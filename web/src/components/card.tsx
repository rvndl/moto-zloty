import { HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  contentClassName?: string;
}

const Card = ({
  title,
  description,
  children,
  className,
  contentClassName,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={twMerge(
        "p-4 md:p-6 rounded-xl border bg-card bg-white shadow",
        className,
      )}
      {...rest}
    >
      {Boolean(title) && (
        <div className="flex flex-col space-y-1.5">
          <p className="font-semibold leading-none tracking-tight">{title}</p>
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

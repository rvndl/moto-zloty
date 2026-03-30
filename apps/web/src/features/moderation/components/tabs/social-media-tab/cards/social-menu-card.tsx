import clsx from "clsx";
import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
  badge?: string;
  onClick: () => void;
}

const SocialMenuCard = ({
  title,
  description,
  icon,
  isActive,
  badge,
  onClick,
}: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full items-start gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow",
        isActive && "border-primary bg-primary/5 shadow-primary/10",
      )}
    >
      <div
        className={clsx(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-accent text-foreground",
          isActive && "border-primary/30 bg-primary/10 text-primary",
        )}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{title}</p>
          {badge && (
            <span className="rounded-full border px-2 py-0.5 text-xs text-muted">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>
    </button>
  );
};

export { SocialMenuCard };

import { Tooltip } from "@components/tooltip";
import { type EventAction } from "@features/event/types";
import { formatDistance, format } from "date-fns";
import { pl } from "date-fns/locale";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface Props {
  action: EventAction;
}

const ActionItem = ({ action }: Props) => {
  const distance = useMemo(() => {
    if (!action.createdAt) return "";
    return formatDistance(action.createdAt, new Date(), {
      locale: pl,
      addSuffix: true,
    });
  }, [action.createdAt]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted">
        <Link href={`/uzytkownik/${action.actorId}`} className="flex w-max">
          <div className="flex gap-2 mt-1">
            <div className="flex items-center justify-center w-6 h-6 p-1 rounded-full bg-accent">
              <UserIcon />
            </div>
            <p className="text-sm">{action.actorName}</p>
          </div>
        </Link>
        &bull;
        <p
          className="text-sm w-max"
          data-tooltip-id="action-created"
          data-tooltip-content={
            action.createdAt ? format(action.createdAt, "dd.MM.yyyy HH:mm") : ""
          }
        >
          {distance}
        </p>
      </div>
      <p>{action.content}</p>
      <Tooltip id="action-created" />
    </div>
  );
};

export { ActionItem };

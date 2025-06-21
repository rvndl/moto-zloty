import { Tooltip } from "@components";
import { EventAction } from "@features/event/api/types/event-action";
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
    return formatDistance(action.created_at, new Date(), {
      locale: pl,
      addSuffix: true,
    });
  }, [action.created_at]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-muted">
        <Link href={`/uzytkownik/${action.actor_id}`} className="flex w-max">
          <div className="flex gap-2 mt-1">
            <div className="flex items-center justify-center w-6 h-6 p-1 rounded-full bg-accent">
              <UserIcon />
            </div>
            <p className="text-sm">{action.actor_name}</p>
          </div>
        </Link>
        &bull;
        <p
          className="text-sm w-max"
          data-tooltip-id="action-created"
          data-tooltip-content={format(action.created_at, "dd.MM.yyyy HH:mm")}
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

import { Card, Skeleton } from "@components";
import { useEventActionsQuery } from "@features/event/api";
import { ActionItem } from "./action-item";
import { useRouter } from "next/router";

const ActionsList = () => {
  const {
    query: { id },
  } = useRouter();

  const { data: actions, isLoading } = useEventActionsQuery(id as string, {
    enabled: Boolean(id),
  });

  const isEmpty = !actions?.length;

  return (
    <Card
      title="Aktualizacje"
      description="Lista ostatnich aktualizacji wydarzenia"
    >
      <section className="flex flex-col gap-4">
        {isLoading && <LoadingPlaceholder />}
        {!isLoading &&
          (isEmpty ? (
            <p className="text-sm text-muted">Brak</p>
          ) : (
            actions?.map((action) => (
              <ActionItem key={action.id} action={action} />
            ))
          ))}
      </section>
    </Card>
  );
};

const LoadingPlaceholder = () => (
  <div className="flex flex-col gap-2">
    <Skeleton className="w-40 h-5" />
    <Skeleton className="w-64 h-5" />
    <Skeleton className="w-20 h-5" />
  </div>
);

export { ActionsList };

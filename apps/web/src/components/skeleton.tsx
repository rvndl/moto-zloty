import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
}

const Skeleton = ({ className }: Props) => {
  return (
    <div
      className={twMerge(
        "w-full h-full rounded-md bg-accent animate-pulse",
        className
      )}
    />
  );
};

export { Skeleton };

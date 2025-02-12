import { ChevronRightIcon } from "@components";

const BreadcrumbSeparator = () => {
  return (
    <li className="inline-flex items-center gap-1.5">
      <ChevronRightIcon className="scale-[0.60]" />
    </li>
  );
};

export { BreadcrumbSeparator };

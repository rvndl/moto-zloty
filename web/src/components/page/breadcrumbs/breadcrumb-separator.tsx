import { ChevronRightIcon } from "@components";

const BreadcrumbSeparator = () => {
  return (
    <li className="inline-flex items-center gap-1.5">
      <ChevronRightIcon className="h-3.5 w-3.6" />
    </li>
  );
};

export { BreadcrumbSeparator };

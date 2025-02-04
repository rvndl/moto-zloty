import {
  Popover as HeadlessPopover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { PropsWithChildren } from "react";

interface Props {
  trigger: React.ReactNode;
  isDisabled?: boolean;
}

const Popover = ({
  trigger,
  isDisabled,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <HeadlessPopover className="relative">
      <PopoverButton disabled={isDisabled}>{trigger}</PopoverButton>
      <PopoverPanel
        transition
        className="z-50 p-4 bg-white border rounded-md shadow-md transition duration-200 ease-in-out data-[closed]:scale-95 data-[closed]:opacity-0"
        anchor="bottom"
      >
        {children}
      </PopoverPanel>
    </HeadlessPopover>
  );
};

export { Popover };

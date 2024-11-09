import {
  Popover as HeadlessPopover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { PropsWithChildren } from "react";

interface Props {
  trigger: React.ReactNode;
}

const Popover = ({ trigger, children }: PropsWithChildren<Props>) => {
  return (
    <HeadlessPopover className="relative">
      <PopoverButton>{trigger}</PopoverButton>
      <PopoverPanel
        className="z-50 p-4 bg-white border rounded-md shadow-md"
        anchor="bottom"
      >
        {children}
      </PopoverPanel>
    </HeadlessPopover>
  );
};

export { Popover };

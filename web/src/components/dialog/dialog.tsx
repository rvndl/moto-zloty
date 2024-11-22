import { ReactNode, useState } from "react";
import {
  Description as DialogDescription,
  DialogPanel,
  DialogTitle,
  Dialog as HeadlessDialog,
} from "@headlessui/react";
import clsx from "clsx";
import { XIcon } from "@components";

interface DialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  footerContent?: ((close: () => void) => ReactNode) | ReactNode;
  isCloseButtonVisible?: boolean;
  unmount?: boolean;
  children: ((close: () => void) => ReactNode) | ReactNode;
  onOpen?: () => void;
}

const Dialog = ({
  trigger,
  title,
  description,
  footerContent,
  isCloseButtonVisible = true,
  unmount,
  children,
  onOpen,
}: DialogProps) => {
  const [open, setOpen] = useState(false);

  const handleOnOpen = () => {
    setOpen(true);
    onOpen?.();
  };
  const handleOnClose = () => {
    setOpen(false);
  };

  return (
    <>
      <span onClick={handleOnOpen}>{trigger}</span>
      <HeadlessDialog
        open={open}
        onClose={setOpen}
        className="fixed z-[9999]"
        unmount={unmount}
      >
        {open && (
          <div
            className="fixed inset-0 bg-black -z-10 opacity-30"
            onClick={handleOnClose}
          />
        )}
        <div className="fixed inset-0 flex items-center justify-center w-screen">
          <DialogPanel className="relative h-full bg-white border border-separate rounded-lg shadow-sm md:h-auto min-w-96">
            {isCloseButtonVisible && <CloseButton onClick={handleOnClose} />}
            <section
              className={clsx(
                "flex flex-col gap-4 px-6 pt-4 rounded-t-lg h-full overflow-auto",
                !footerContent && "pb-6"
              )}
            >
              <div className="mb-2">
                {Boolean(title) && (
                  <DialogTitle className="text-lg font-semibold">
                    {title}
                  </DialogTitle>
                )}
                {Boolean(description) && (
                  <DialogDescription className="text-sm text-black text-opacity-70">
                    {description}
                  </DialogDescription>
                )}
              </div>
              {typeof children === "function"
                ? children(handleOnClose)
                : children}
            </section>
            {footerContent && (
              <section className="flex flex-row-reverse gap-4 px-6 pb-6 mt-2 rounded-b-lg">
                {typeof footerContent === "function"
                  ? footerContent(handleOnClose)
                  : footerContent}
              </section>
            )}
          </DialogPanel>
        </div>
      </HeadlessDialog>
    </>
  );
};

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="absolute text-xl font-thin transition-opacity opacity-50 cursor-pointer right-4 top-4 hover:opacity-100"
    onClick={onClick}
  >
    <XIcon />
  </button>
);

export { Dialog };

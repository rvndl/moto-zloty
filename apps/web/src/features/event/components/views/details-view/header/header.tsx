import { getFilePath } from "@utils/index";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DescriptionList } from "./description-list";
import { type Event } from "@features/event/types";
import { Dropdown } from "@components/dropdown";
import { useAuth } from "@features/auth";
import { Button } from "@components/button";
import { EllipsisIcon } from "lucide-react";
import { ChangeAddressDialog, ChangeStatusDialog } from "../body";

interface Props {
  event?: Event;
}

const Header = ({ event }: Props) => {
  const [opacity, setOpacity] = useState(0.3);

  const { isPermitted, isOwner } = useAuth();
  const changeAddressOpenRef = useRef<(() => void) | null>(null);
  const changeStatusOpenRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setTimeout(() => setOpacity(1), 0);
  }, []);

  return (
    <div className="h-[30vh] relative flex items-end justify-center bg-black">
      <Image
        src={getFilePath(event?.bannerId)}
        alt={event?.name ?? ""}
        style={{
          maskImage: `linear-gradient(
            to top,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 1)
          )`,
        }}
        className={clsx(
          "h-full w-full object-cover grayscale pointer-events-none transition duration-500 brightness-50 absolute",
          opacity === 1 ? "opacity-60" : "opacity-0",
        )}
        width={1200}
        height={630}
        priority
      />
      <section className="max-w-7xl z-10 w-full flex flex-col gap-7 md:gap-8 mb-12 px-2 sm:px-6 lg:px-8">
        <hgroup className="flex flex-col w-full max-w-full md:max-w-[50%] text-white">
          <h1 className="text-2xl md:text-4xl font-semibold">{event?.name}</h1>
        </hgroup>

        {event && <DescriptionList event={event} />}

        <div className="absolute top-5 right-5 z-50">
          <Dropdown
            items={[
              {
                label: "Zmień adres",
                isHidden: !isOwner(event?.accountId) && !isPermitted,
                onClick: () => changeAddressOpenRef.current?.(),
              },
              {
                label: "Zmień status",
                isHidden: !isPermitted,
                onClick: () => changeStatusOpenRef.current?.(),
              },
            ]}
            trigger={
              <Button
                icon={<EllipsisIcon size={28} className="" />}
                variant="ghost"
                className="text-white hover:bg-white/10"
              />
            }
          />
        </div>
      </section>

      {event && (
        <>
          <ChangeAddressDialog event={event} openRef={changeAddressOpenRef} />
          <ChangeStatusDialog event={event} openRef={changeStatusOpenRef} />
        </>
      )}
    </div>
  );
};

export { Header };

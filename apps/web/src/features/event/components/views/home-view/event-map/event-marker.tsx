import { type MapEvent } from "@features/event/types";
import { getEventStatus } from "@utils/event";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MapMarker } from "@components/map";
import { Popover } from "@headlessui/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";
import { getFilePath } from "@utils/index";
import { Button } from "@components/button";
import { makeAddressString } from "@features/event/utils";
import { ArrowRightIcon, ClockIcon } from "lucide-react";

interface Props {
  event: MapEvent;
}

const EventMarker = ({ event }: Props) => {
  const router = useRouter();
  const { isOngoing } = useMemo(() => getEventStatus(event), [event]);

  const handleOnDetails = () => router.push(`/wydarzenie/${event.id}`);

  return (
    <MapMarker
      latitude={event.latitude}
      longitude={event.longitude}
      showMarker={false}
      isLive={isOngoing}
    >
      <Popover>
        <Popover.Button as="div" className="cursor-pointer">
          <svg
            height={16}
            viewBox="0 0 24 24"
            className={clsx(
              "size-3 rounded-full outline outline-[6px] outline-black/20",
              isOngoing
                ? "bg-red-600 outline-red-600/20"
                : "bg-black outline-black/20",
            )}
          />
        </Popover.Button>

        <Popover.Panel className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0.5, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl w-56 border shadow"
          >
            <Image
              src={getFilePath(event.bannerId)}
              alt={event.name}
              width={200}
              height={200}
              className="object-cover w-full rounded-2xl aspect-square"
            />
            <div className="p-2.5">
              <p className="text-lg font-medium truncate">{event.name}</p>
              <p className="text-sm text-muted font-light truncate">
                {makeAddressString(event.fullAddress)}
              </p>
              <div className="mt-3.5 grid grid-cols-2 place-content-center">
                <div className="flex items-center text-muted gap-1.5">
                  <ClockIcon size={16} />
                  <p>za 2 dni</p>
                </div>
                <Button
                  size="small"
                  className="rounded-2xl"
                  onClick={handleOnDetails}
                >
                  Szczegóły
                  <ArrowRightIcon className="size-10" />
                </Button>
              </div>
            </div>
          </motion.div>
        </Popover.Panel>
      </Popover>
    </MapMarker>
  );
};

motion;

export { EventMarker };

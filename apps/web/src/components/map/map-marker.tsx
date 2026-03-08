import clsx from "clsx";
import { useCallback } from "react";
import { Marker, MarkerProps, useMap } from "react-map-gl/maplibre";

interface Props extends MarkerProps {
  zoomOnClick?: boolean;
  showMarker?: boolean;
  isLive?: boolean;
}

const MapMarker = ({
  children,
  isLive,
  zoomOnClick = true,
  showMarker = true,
  ...rest
}: Props) => {
  const map = useMap();

  const handleOnClick = useCallback(
    // TODO: Fix the argument type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      rest.onClick?.(e);

      if (zoomOnClick) {
        map.current?.flyTo({
          center: [rest.longitude, rest.latitude],
          zoom: 15,
          offset: [0, 100],
        });
      }
    },
    [zoomOnClick, map, rest],
  );

  return (
    <Marker onClick={handleOnClick} {...rest}>
      {showMarker && (
        <svg
          height={16}
          viewBox="0 0 24 24"
          className={clsx(
            "size-3  rounded-full outline outline-[6px] outline-black/20",
            isLive
              ? "bg-red-600 outline-red-600/20"
              : "bg-black outline-black/20",
          )}
        ></svg>
      )}
      {children}
    </Marker>
  );
};

export { MapMarker };

import { memo, PropsWithChildren } from "react";
import { Spinner } from "@components/spinner";
import {
  LngLatBoundsLike,
  default as MapLibre,
  MapProps,
} from "react-map-gl/maplibre";
import { twMerge } from "tailwind-merge";

const CENTER_OF_POLAND: [number, number] = [52.106379, 19.495893];
const POLAND_BOUNDS: LngLatBoundsLike = [
  [11.5, 48.9],
  [26.8, 55.0],
];

interface Props extends Partial<MapProps> {
  zoom?: number;
  isLoading?: boolean;
  className?: string;
}

const Map = ({
  zoom = 5,
  initialViewState = {
    latitude: CENTER_OF_POLAND[0],
    longitude: CENTER_OF_POLAND[1],
    zoom,
  },
  isLoading,
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={twMerge(
        "min-w-full min-h-full border rounded-xl w-full h-full",
        className,
      )}
    >
      <MapLibre
        style={{ borderRadius: "0.75rem" }}
        initialViewState={initialViewState}
        mapStyle={process.env.NEXT_PUBLIC_MAP_TILE_STYLES_URL}
        maxBounds={POLAND_BOUNDS}
        minZoom={5}
        {...rest}
      >
        {isLoading && (
          <div className="absolute top-0 left-0 z-[400] w-full h-full bg-black/30 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        {children}
      </MapLibre>
    </div>
  );
};

export const MemoizedMap = memo(Map);

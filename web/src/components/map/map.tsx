import "leaflet/dist/leaflet.css";

import { PropsWithChildren } from "react";
import { Spinner } from "@components/spinner";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

const CENTER_OF_POLAND: LatLngExpression = [52.106379, 19.495893];

interface Props {
  zoom?: number;
  isLoading?: boolean;
}

export const Map = ({
  zoom = 6,
  isLoading,
  children,
}: PropsWithChildren<Props>) => {
  const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    {
      ssr: false,
    },
  );

  const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    {
      ssr: false,
    },
  );

  return (
    <MapContainer
      center={CENTER_OF_POLAND}
      zoom={zoom}
      scrollWheelZoom={true}
      className="relative min-w-full min-h-full border rounded-xl"
    >
      {isLoading && (
        <div className="absolute top-0 left-0 z-[400] w-full h-full bg-black/30 flex items-center justify-center">
          <Spinner />
        </div>
      )}
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" />
      {children}
    </MapContainer>
  );
};

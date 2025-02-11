import "leaflet/dist/leaflet.css";

import { type LatLngExpression } from "leaflet";
import { PropsWithChildren } from "react";
import { Spinner } from "@components";
import dynamic from "next/dynamic";

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
    }
  );

  const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    {
      ssr: false,
    }
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
      />
      {children}
    </MapContainer>
  );
};

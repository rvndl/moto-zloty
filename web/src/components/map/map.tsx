import "leaflet/dist/leaflet.css";

import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { PropsWithChildren } from "react";

const CENTER_OF_POLAND: LatLngExpression = [52.106379, 19.495893];

// Workaround for leaflet tiles bug
const ComponentResize = ({ zoom }: { zoom: number }) => {
  const map = useMap();
  setTimeout(() => {
    map.invalidateSize();
    map.setZoom(zoom);
  }, 0);

  return null;
};

interface Props {
  zoom?: number;
}

export const Map = ({ zoom = 6, children }: PropsWithChildren<Props>) => {
  return (
    <MapContainer
      center={CENTER_OF_POLAND}
      zoom={zoom}
      scrollWheelZoom={true}
      className="min-w-full min-h-full border rounded-xl"
    >
      <ComponentResize zoom={zoom} />
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

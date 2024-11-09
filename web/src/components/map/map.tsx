import "leaflet/dist/leaflet.css";

import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { PropsWithChildren } from "react";

const CENTER_OF_POLAND: LatLngExpression = [52.106379, 19.495893];

interface Props {
  zoom?: number;
}

// Workaround for leaflet tiles bug
const ComponentResize = () => {
  const map = useMap();
  setTimeout(() => map.invalidateSize(), 0);

  return null;
};

export const Map = ({ zoom = 6, children }: PropsWithChildren<Props>) => {
  return (
    <MapContainer
      center={CENTER_OF_POLAND}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ minHeight: "100%", minWidth: "100%", borderRadius: "10px" }}
    >
      <ComponentResize />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {children}
    </MapContainer>
  );
};

import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

const CENTER_OF_POLAND: LatLngExpression = [52.106379, 19.495893];

export const Map = () => {
  return (
    <MapContainer
      center={CENTER_OF_POLAND}
      zoom={7}
      scrollWheelZoom={true}
      style={{ minHeight: "100%", minWidth: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
};

import { Icon } from "leaflet";
import { ComponentProps } from "react";
import { Marker } from "react-leaflet";

const icon = new Icon({
  iconUrl: `${import.meta.env.VITE_PUBLIC_URL}/marker.png`,
  iconSize: [20.8, 34],
  iconAnchor: [16, 32],
});

const liveIcon = new Icon({
  iconUrl: `${import.meta.env.VITE_PUBLIC_URL}/marker-live.png`,
  iconSize: [20.8, 34],
  iconAnchor: [16, 32],
});

type MarkerProps = ComponentProps<typeof Marker>;

interface Props extends MarkerProps {
  isLive?: boolean;
}

const MapMarker = ({ isLive, children, ...rest }: Props) => {
  return (
    <Marker icon={isLive ? liveIcon : icon} {...rest}>
      {children}
    </Marker>
  );
};

export { MapMarker };

import dynamic from "next/dynamic";
import { type MarkerProps } from "react-leaflet";
import { Icon } from "../../leaflet-local";

const icon = new Icon({
  iconUrl: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/marker.png`,
  iconSize: [20.8, 34],
  iconAnchor: [16, 32],
});

const liveIcon = new Icon({
  iconUrl: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/marker-live.png`,
  iconSize: [20.8, 34],
  iconAnchor: [16, 32],
});

interface Props extends MarkerProps {
  isLive?: boolean;
}

const MapMarker = ({ isLive, children, ...rest }: Props) => {
  const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    {
      ssr: false,
    }
  );
  return (
    // @ts-expect-error custom icon implementation due to leaflet using `window` object during any import, which is not ssr compatible
    <Marker icon={isLive ? liveIcon : icon} {...rest}>
      {children}
    </Marker>
  );
};

export { MapMarker };

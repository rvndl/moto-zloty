// import { Icon } from "leaflet";
import dynamic from "next/dynamic";
import { ComponentProps } from "react";

// const icon = new Icon({
//   iconUrl: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/marker.png`,
//   iconSize: [20.8, 34],
//   iconAnchor: [16, 32],
// });

// const liveIcon = new Icon({
//   iconUrl: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/marker-live.png`,
//   iconSize: [20.8, 34],
//   iconAnchor: [16, 32],
// });

type MarkerProps = ComponentProps<any>;

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
  // icon={isLive ? liveIcon : icon}
  return <Marker {...rest}>{children}</Marker>;
};

export { MapMarker };

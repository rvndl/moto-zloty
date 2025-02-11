import { Map, MapMarker, useForm } from "@components";
import { withDynamicHook } from "@hoc";
import { PropsWithChildren } from "react";

interface Props {
  latitude?: number;
  longitude?: number;
  isLoading?: boolean;
  className?: string;
  useMap?: () => any;
}

const MapWrapper = ({
  children,
  isLoading,
  className,
}: PropsWithChildren<Pick<Props, "isLoading" | "className">>) => {
  return (
    <div className={className}>
      <Map isLoading={isLoading}>{children}</Map>
    </div>
  );
};

const PreviewMap = ({ latitude, longitude, isLoading, className }: Props) => {
  return (
    <MapWrapper className={className} isLoading={isLoading}>
      <MapContent latitude={latitude} longitude={longitude} />
    </MapWrapper>
  );
};

const MapContent = withDynamicHook<Props>(
  "useMap",
  () => import("react-leaflet"),
  ({ latitude: latitudeProps, longitude: longitudeProps, useMap }: Props) => {
    const form = useForm();
    const map = useMap?.();

    const address = form?.watch?.("address");
    const latitude = address?.value?.latitude ?? latitudeProps;
    const longitude = address?.value?.longitude ?? longitudeProps;

    map.whenReady(() => {
      // Workaround for shared leaflet map
      if (latitude && longitude) {
        setTimeout(() => map.setView([latitude, longitude], 16), 0);
      }
    });

    if (!latitude || !longitude) {
      return null;
    }

    return <MapMarker position={[latitude, longitude]} />;
  }
);

export { PreviewMap };

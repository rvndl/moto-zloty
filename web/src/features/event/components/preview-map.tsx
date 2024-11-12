import { useForm } from "@components/form";
import { Map } from "@components/map";
import { PropsWithChildren } from "react";
import { Marker, useMap } from "react-leaflet";

interface Props {
  latitude?: number;
  longitude?: number;
  isLoading?: boolean;
  className?: string;
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

const MapContent = ({
  latitude: latitudeProps,
  longitude: longitudeProps,
}: Props) => {
  const form = useForm();
  const map = useMap();

  const address = form?.watch?.("address");
  const latitude = address?.value?.latitude ?? latitudeProps;
  const longitude = address?.value?.longitude ?? longitudeProps;

  map.whenReady(() => {
    // Workaround for shared leaflet map
    setTimeout(() => map.setView([latitude, longitude], 16), 0);
  });

  if (!latitude || !longitude) {
    return null;
  }

  return <Marker position={[latitude, longitude]} />;
};

export { PreviewMap };

import { useForm } from "@components/form";
import { Map } from "@components/map";
import { PropsWithChildren } from "react";
import { Marker, useMap } from "react-leaflet";

const MapWrapper = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={className}>
      <Map>{children}</Map>
    </div>
  );
};

interface Props {
  latitude?: number;
  longitude?: number;
  className?: string;
}

const PreviewMap = ({ latitude, longitude, className }: Props) => {
  return (
    <MapWrapper className={className}>
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

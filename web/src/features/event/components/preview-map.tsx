import { useForm } from "@components/form";
import { Map, MapMarker } from "@components/map";
import { PropsWithChildren, useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

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
  const latitude = address?.value?.lat ?? latitudeProps;
  const longitude = address?.value?.lon ?? longitudeProps;

  useEffect(() => {
    map.current?.flyTo({
      center: [longitude, latitude],
      zoom: 16,
    });
  }, []);

  if (!latitude || !longitude) {
    return null;
  }

  return (
    <MapMarker latitude={latitude} longitude={longitude} zoomOnClick={false} />
  );
};

export { PreviewMap };

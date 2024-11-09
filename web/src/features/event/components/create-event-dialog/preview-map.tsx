import { useForm } from "@components/form";
import { Map } from "@components/map";
import { PropsWithChildren, useEffect } from "react";
import { Marker, useMap } from "react-leaflet";

const MapWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-[32rem] w-[32rem]">
      <Map>{children}</Map>
    </div>
  );
};

const PreviewMap = () => {
  return (
    <MapWrapper>
      <MapContent />
    </MapWrapper>
  );
};

const MapContent = () => {
  const { watch } = useForm();
  const map = useMap();

  const address = watch("address");
  const latitude = address?.value?.latitude;
  const longitude = address?.value?.longitude;

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 16, { animate: true });
    }
  }, [latitude, longitude]);

  if (!latitude || !longitude) {
    return null;
  }

  return <Marker position={[latitude, longitude]} />;
};

export { PreviewMap };

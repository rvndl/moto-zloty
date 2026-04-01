import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import type { DropzoneProps } from "@components/dropzone";
import dynamic from "next/dynamic";

const Dropzone = dynamic(
  () => import("@components/dropzone").then((m) => m.Dropzone),
  { ssr: false },
);

const DropzoneField = ({
  name,
  ...rest
}: DropzoneProps & {
  name: string;
}) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return <Dropzone {...field} {...rest} />;
      }}
    />
  );
};

export { DropzoneField };

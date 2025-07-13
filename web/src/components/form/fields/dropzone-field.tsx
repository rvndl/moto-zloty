import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import { Dropzone, DropzoneProps } from "@components/dropzone";

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

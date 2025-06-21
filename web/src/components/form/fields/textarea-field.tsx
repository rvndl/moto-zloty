import { Textarea, TextareaProps } from "@components";
import { Controller } from "react-hook-form";
import { WithRequired } from "utils";
import { useForm } from "../fom-context";

const TextareaField = ({
  name,
  ...rest
}: WithRequired<TextareaProps, "name">) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = formState.errors[name]?.message as string;
        return <Textarea error={error} {...field} {...rest} />;
      }}
    />
  );
};

export { TextareaField };

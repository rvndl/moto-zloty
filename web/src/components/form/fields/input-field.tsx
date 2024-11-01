import { Input, InputProps } from "@components/ui";
import { Controller } from "react-hook-form";
import { WithRequired } from "utils";
import { useFromControl } from "../fom-control-context";

const InputField = ({ name, ...rest }: WithRequired<InputProps, "name">) => {
  const control = useFromControl();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = formState.errors[name]?.message as string;
        return <Input error={error} {...field} {...rest} />;
      }}
    />
  );
};

export { InputField };

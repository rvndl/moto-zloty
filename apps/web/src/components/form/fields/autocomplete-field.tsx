import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import { Autocomplete, AutocompleteProps } from "@components/autocomplete";

const AutocompleteField = ({
  name,
  ...rest
}: AutocompleteProps & { name: string }) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = formState.errors[name]?.message as string;
        return <Autocomplete error={error} {...field} {...rest} />;
      }}
    />
  );
};

export { AutocompleteField };

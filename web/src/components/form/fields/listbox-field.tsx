import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import { Listbox, ListboxProps } from "@components/listbox";

const ListboxField = ({ name, ...rest }: ListboxProps & { name: string }) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = formState.errors[name]?.message as string;
        return <Listbox error={error} {...field} {...rest} />;
      }}
    />
  );
};

export { ListboxField };

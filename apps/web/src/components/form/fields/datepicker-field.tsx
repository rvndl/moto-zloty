import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import { Datepicker, DatepickerProps } from "@components/datepicker";

const DatepickerField = ({
  name,
  ...rest
}: DatepickerProps & { name: string }) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState }) => {
        const error = formState.errors[name]?.message as string;
        return <Datepicker error={error} {...field} {...rest} />;
      }}
    />
  );
};

export { DatepickerField };

import { useForm } from "@components/form";
import { DatepickerField } from "@components/form/fields/datepicker-field";

const DatePicker = () => {
  const { watch } = useForm();
  const date_from = watch("date_from");

  return (
    <div className="flex justify-between gap-4">
      <DatepickerField
        name="date_from"
        label="Data od"
        calendarProps={{ disabled: { before: new Date() } }}
        showTimepicker
        isRequired
      />
      <DatepickerField
        name="date_to"
        label="Data do"
        calendarProps={{ disabled: { before: date_from }, month: date_from }}
        isDisabled={!date_from}
        showTimepicker
        isRequired
      />
    </div>
  );
};

export { DatePicker };

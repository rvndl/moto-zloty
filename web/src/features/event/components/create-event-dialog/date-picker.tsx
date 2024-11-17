import { DatepickerField, useForm } from "@components";

const DatePicker = () => {
  const { watch } = useForm();
  const date_from = watch("date_from");

  return (
    <div className="flex justify-between gap-4">
      <DatepickerField
        name="date_from"
        label="Data od"
        calendarProps={{ disabled: { before: new Date() } }}
        isRequired
      />
      <DatepickerField
        name="date_to"
        label="Data do"
        calendarProps={{ disabled: { before: date_from } }}
        isDisabled={!date_from}
        isRequired
      />
    </div>
  );
};

export { DatePicker };

import { useForm } from "@components/form";
import { DatepickerField } from "@components/form/fields/datepicker-field";

const DatePicker = () => {
  const { watch } = useForm();
  const dateFrom = watch("dateFrom");

  return (
    <div className="flex justify-between gap-4">
      <DatepickerField
        name="dateFrom"
        label="Data od"
        calendarProps={{ disabled: { before: new Date() } }}
        showTimepicker
        isRequired
      />
      <DatepickerField
        name="dateTo"
        label="Data do"
        calendarProps={{ disabled: { before: dateFrom } }}
        isDisabled={!dateFrom}
        showTimepicker
        isRequired
      />
    </div>
  );
};

export { DatePicker };

import { ReactNode } from "react";
import { FieldValues, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { FormControlContext } from "./fom-control-context";

interface Props<TValues> {
  onSubmit: (values: TValues) => void;
  defaultValues?: Partial<Record<keyof TValues, any>>;
  resolver?: Resolver<Record<string, any>, any>;
  children: ((isValid?: boolean) => ReactNode) | ReactNode;
}

const Form = <TValues,>({
  defaultValues,
  onSubmit,
  children,
  resolver,
}: Props<TValues>) => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    resolver,
    defaultValues: defaultValues as Record<string, any>,
    mode: "all",
  });

  return (
    <FormControlContext.Provider value={control}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
      >
        {typeof children === "function" ? children(isValid) : children}
      </form>
    </FormControlContext.Provider>
  );
};

export { Form };

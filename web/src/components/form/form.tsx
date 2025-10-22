import { ReactNode } from "react";
import { FieldValues, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { FormContext } from "./fom-context";

interface FormRef {
  clear: () => void;
}

interface Props<TValues> {
  onSubmit:
    | ((reset: () => void) => (values: TValues) => void)
    | ((values: TValues) => void);
  defaultValues?: Partial<Record<keyof TValues, unknown>>;
  values?: Partial<Record<keyof TValues, unknown>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolver?: Resolver<any>;
  children: ((isValid?: boolean) => ReactNode) | ReactNode;
}

const Form = <TValues,>({
  defaultValues,
  onSubmit,
  children,
  resolver,
  values,
}: Props<TValues>) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { isValid },
  } = useForm({
    resolver,
    defaultValues: defaultValues as Record<string, unknown>,
    values,
    mode: "all",
  });

  return (
    <FormContext.Provider value={{ control, watch }}>
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
      >
        {typeof children === "function" ? children(isValid) : children}
      </form>
    </FormContext.Provider>
  );
};

export { Form, type FormRef };

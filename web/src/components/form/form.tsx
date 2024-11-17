import { ReactNode, useEffect } from "react";
import { FieldValues, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { FormContext } from "./fom-context";
import { setupYup } from "@utils/yup";

interface Props<TValues> {
  onSubmit: (values: TValues) => void;
  defaultValues?: Partial<Record<keyof TValues, any>>;
  resolver?: Resolver<any>;
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
    watch,
    formState: { isValid },
  } = useForm({
    resolver,
    defaultValues: defaultValues as Record<string, any>,
    mode: "all",
  });

  useEffect(() => {
    setupYup();
  }, []);

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

export { Form };

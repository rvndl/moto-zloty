import { createContext, useContext } from "react";
import { Control, FieldValues, UseFormWatch } from "react-hook-form";

const FormContext = createContext<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<FieldValues, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
  // @ts-expect-error workaround
}>(undefined);

const useForm = () => useContext(FormContext);

// eslint-disable-next-line react-refresh/only-export-components
export { FormContext, useForm };

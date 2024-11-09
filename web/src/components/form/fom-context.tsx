import { createContext, useContext } from "react";
import { Control, FieldValues, UseFormWatch } from "react-hook-form";

const FormContext = createContext<{
  control: Control<FieldValues, any>;
  watch: UseFormWatch<any>;
  // @ts-ignore
}>(undefined);

const useForm = () => useContext(FormContext);

export { FormContext, useForm };

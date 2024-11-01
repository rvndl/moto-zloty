import { createContext, useContext } from "react";
import { Control, FieldValues } from "react-hook-form";

const FormControlContext =
  // @ts-ignore
  createContext<Control<FieldValues, any>>(undefined);

const useFromControl = () => useContext(FormControlContext);

export { FormControlContext, useFromControl };

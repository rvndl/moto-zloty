import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import { TextEditor, TextEditorProps } from "@components";

const TextEditorField = ({
  name,
  ...rest
}: TextEditorProps & { name: string }) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return <TextEditor {...field} {...rest} />;
      }}
    />
  );
};

export { TextEditorField };

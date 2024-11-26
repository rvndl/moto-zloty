import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import Turnstile, { TurnstileProps } from "react-turnstile";

const sitekey = import.meta.env.VITE_TURNSTILE_KEY;

const ReCaptchaField = ({
  name,
}: Partial<TurnstileProps> & { name: string }) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => {
        return (
          <Turnstile onVerify={onChange} sitekey={sitekey} theme="light" />
        );
      }}
    />
  );
};

export { ReCaptchaField };

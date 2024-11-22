import { Controller } from "react-hook-form";
import { useForm } from "../fom-context";
import ReCAPTCHA, { ReCAPTCHAProps } from "react-google-recaptcha";

const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ReCaptchaField = ({
  name,
}: Partial<ReCAPTCHAProps> & { name: string }) => {
  const { control } = useForm();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => {
        return <ReCAPTCHA onChange={onChange} sitekey={sitekey} />;
      }}
    />
  );
};

export { ReCaptchaField };

import { Button } from "@components/button";
import { Form } from "@components/form";
import { InputField, ReCaptchaField } from "@components/form/fields";
import { useRegisterMutation } from "@features/auth/api";
import { useAuth } from "@features/auth/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import toast from "react-hot-toast";

interface Fields {
  username: string;
  password: string;
  password2: string;
  email: string;
}

const schema = yup.object<Fields>({
  username: yup.string().required().min(3).max(32),
  password: yup.string().required().min(8).max(64),
  password2: yup
    .string()
    .oneOf([yup.ref("password")], "Hasła muszą być takie same"),
  email: yup.string().required().email().max(128),
  recaptcha: yup.string().required(),
});

const RegisterForm = () => {
  const { setState } = useAuth();
  const { mutate: register, isPending } = useRegisterMutation({
    onSuccess: (data) => {
      setState(data);
      toast.success("Utworzono nowe konto");
    },
  });

  const handleOnRegister = (values: Fields) => register(values);

  return (
    <section className="flex flex-col">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">Rejestracja</h1>
        <p className="text-muted text-sm">
          Wpisz swój login i hasło, aby się zarejestrować.
        </p>
      </div>
      <Form<Fields> onSubmit={handleOnRegister} resolver={yupResolver(schema)}>
        {(isValid) => (
          <>
            <InputField
              name="username"
              label="Login"
              placeholder="Login"
              isRequired
            />
            <InputField
              name="password"
              label="Hasło"
              placeholder="***"
              type="password"
              isRequired
            />
            <InputField
              name="password2"
              label="Powtórz hasło"
              placeholder="***"
              type="password"
              isRequired
            />
            <InputField
              name="email"
              label="E-mail"
              placeholder="email@example.com"
              type="email"
              isRequired
            />
            <ReCaptchaField name="recaptcha" />
            <Button
              type="submit"
              loadingText="Tworzenie konta..."
              isLoading={isPending}
              disabled={!isValid || isPending}
            >
              Utwórz konto
            </Button>
          </>
        )}
      </Form>
    </section>
  );
};

export { RegisterForm };

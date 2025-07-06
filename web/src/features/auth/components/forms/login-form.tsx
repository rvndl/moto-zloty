import { Button, Form, InputField, ReCaptchaField } from "@components";
import { useLoginMutation } from "@features/auth/api";
import { useAuth } from "@features/auth/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Fields {
  username: string;
  password: string;
}

const schema = yup.object<Fields>({
  username: yup
    .string()
    .required()
    .min(3, "Login musi mieć co najmniej 3 znaki")
    .max(32),
  password: yup
    .string()
    .required()
    .min(8, "Hasło musi mieć co najmniej 8 znaków")
    .max(64),
  recaptcha: yup.string().required(),
});

const LoginForm = () => {
  const { setState } = useAuth();
  const router = useRouter();
  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (data) => {
      setState(data);
      toast.success("Zalogowano pomyślnie!");
      router.push("/");
    },
  });

  const handleOnLogin = (values: Fields) => login(values);

  return (
    <section className="flex flex-col">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold">Logowanie</h1>
        <p className="text-muted text-sm">
          Wpisz swój login i hasło, aby się zalogować.
        </p>
      </div>
      <Form<Fields> onSubmit={handleOnLogin} resolver={yupResolver(schema)}>
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
            <ReCaptchaField name="recaptcha" />
            <Button
              type="submit"
              loadingText="Logowanie..."
              isLoading={isPending}
              disabled={!isValid || isPending}
            >
              Zaloguj się
            </Button>
          </>
        )}
      </Form>
    </section>
  );
};

export { LoginForm };

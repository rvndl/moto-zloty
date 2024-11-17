import { Button, ButtonProps, Dialog, Form, InputField } from "@components";
import { useLoginMutation } from "../api";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { RegisterDialog } from "./register-dialog";
import toast from "react-hot-toast";
import { useAuth } from "../hooks";

interface Fields {
  username: string;
  password: string;
}

const schema = yup.object<Fields>({
  username: yup
    .string()
    .required()
    .min(3, "Login musi mieć co najmniej 3 znaki"),
  password: yup
    .string()
    .required()
    .min(8, "Hasło musi mieć co najmniej 8 znaków"),
});

interface Props {
  label?: string;
  buttonProps?: ButtonProps;
}

const LoginDialog = ({ label = "Zaloguj się", buttonProps }: Props) => {
  const { setState } = useAuth();
  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (data) => {
      setState(data);
      toast.success("Zalogowano pomyślnie!");
    },
  });

  const handleOnLogin = (values: Fields) => {
    login(values);
  };

  return (
    <Dialog
      title="Logowanie"
      description="Zaloguj się na swoje konto"
      trigger={
        <Button variant="ghost" {...buttonProps}>
          {label}
        </Button>
      }
      unmount={false}
    >
      {(close) => (
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
              <Button
                type="submit"
                loadingText="Logowanie..."
                isLoading={isPending}
                disabled={!isValid || isPending}
              >
                Zaloguj się
              </Button>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-black text-opacity-70">
                  Nie posiadasz konta?
                </p>
                <RegisterDialog onOpen={close} />
              </div>
            </>
          )}
        </Form>
      )}
    </Dialog>
  );
};

export { LoginDialog };

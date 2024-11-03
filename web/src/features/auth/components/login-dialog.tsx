import { Dialog } from "@components/dialog";
import { Button } from "@components/ui";
import { useLoginMutation } from "../api";
import { Form, InputField } from "@components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { RegisterDialog } from "./register-dialog";
import { useUserStore } from "@store/user-store";
import toast from "react-hot-toast";

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

const LoginDialog = () => {
  const setUserState = useUserStore((state) => state.setState);
  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (data) => {
      setUserState(data);
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
      trigger={<Button variant="ghost">Zaloguj się</Button>}
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
              <Button type="submit" isLoading={isPending} disabled={!isValid}>
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

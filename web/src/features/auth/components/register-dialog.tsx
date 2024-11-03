import { Dialog } from "@components/dialog";
import { Button } from "@components/ui";
import { useRegisterMutation } from "../api";
import { Form, InputField } from "@components/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";

interface Fields {
  username: string;
  password: string;
  password2: string;
  email: string;
}

const schema = yup.object<Fields>({
  username: yup.string().required().min(3),
  password: yup.string().required().min(8),
  password2: yup
    .string()
    .oneOf([yup.ref("password")], "Hasła muszą być takie same"),
  email: yup.string().required().email(),
});

interface Props {
  onOpen?: () => void;
}

const RegisterDialog = ({ onOpen }: Props) => {
  const { mutate: register, isPending } = useRegisterMutation();

  const handleOnRegister = (values: Fields) => {
    register(values);
  };

  return (
    <Dialog
      title="Rejestracja"
      description="Stwórz swoje nowe konto"
      trigger={
        <Button className="w-full" variant="outline">
          Utwórz nowe konto
        </Button>
      }
      onOpen={onOpen}
    >
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
            <Button type="submit" isLoading={isPending} disabled={!isValid}>
              Utwórz konto
            </Button>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export { RegisterDialog };

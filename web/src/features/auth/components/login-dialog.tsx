import { Dialog } from "@components/dialog";
import { Button } from "@components/ui";
import { useLoginMutation } from "../api";
import { Form, InputField } from "@components/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Fields {
  username: string;
  password: string;
}

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

const LoginDialog = () => {
  const { mutate: login, isPending } = useLoginMutation();

  const handleOnLogin = (values: Fields) => {
    login(values);
  };

  return (
    <Dialog
      title="Logowanie"
      description="Zaloguj się na swoje konto"
      trigger={<Button>Zaloguj się</Button>}
    >
      <Form<Fields> onSubmit={handleOnLogin} resolver={zodResolver(schema)}>
        {(isValid) => (
          <>
            <InputField name="username" placeholder="Login" />
            <InputField name="password" placeholder="Hasło" type="password" />
            <Button type="submit" isLoading={isPending} disabled={!isValid}>
              Zaloguj się
            </Button>
          </>
        )}
      </Form>
    </Dialog>
  );
};

export { LoginDialog };

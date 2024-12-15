import { Button, Card, Form, InputField } from "@components";
import {
  ChangePasswordPayload,
  useChangePasswordMutation,
} from "@features/account/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import toast from "react-hot-toast";

type Fields = ChangePasswordPayload;

const schema = yup.object({
  current_password: yup.string().required(),
  new_password: yup.string().required(),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Hasła muszą być takie same"),
});

const ChangePasswordSection = () => {
  const { mutate, isPending } = useChangePasswordMutation({
    onSuccess: () => toast.success("Hasło zostało zmienione"),
  });

  const handleOnSubmit = (fields: Fields) => mutate(fields);

  return (
    <Card title="Zmiana hasła" description="Zmień swoje hasło">
      <Form<Fields> onSubmit={handleOnSubmit} resolver={yupResolver(schema)}>
        <InputField
          name="current_password"
          label="Aktualne hasło"
          type="password"
          isRequired
        />
        <InputField
          name="new_password"
          label="Nowe hasło"
          type="password"
          isRequired
        />
        <InputField
          name="confirm_password"
          label="Powtórz nowe hasło"
          type="password"
          isRequired
        />
        <Button type="submit" isLoading={isPending} disabled={isPending}>
          Zmień hasło
        </Button>
      </Form>
    </Card>
  );
};

export { ChangePasswordSection };

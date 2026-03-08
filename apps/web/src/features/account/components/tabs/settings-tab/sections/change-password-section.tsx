import { Button } from "@components/button";
import { Card } from "@components/card";
import { Form } from "@components/form";
import { InputField } from "@components/form/fields";

import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { api, InferBody, useMutation } from "api/eden";
import toast from "react-hot-toast";

type Fields = InferBody<typeof api.account.changePassword.patch>;

const schema = yup.object({
  currentPassword: yup.string().required(),
  newPassword: yup.string().required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Hasła muszą być takie same"),
});

const ChangePasswordSection = () => {
  const { mutate, isPending } = useMutation(api.account.changePassword.patch, {
    onSuccess: () => toast.success("Hasło zostało zmienione"),
  });

  const handleOnSubmit = (fields: Fields) => mutate(fields);

  return (
    <Card title="Zmiana hasła" description="Zmień swoje hasło">
      <Form<Fields> onSubmit={handleOnSubmit} resolver={yupResolver(schema)}>
        <InputField
          name="currentPassword"
          label="Aktualne hasło"
          type="password"
          isRequired
        />
        <InputField
          name="newPassword"
          label="Nowe hasło"
          type="password"
          isRequired
        />
        <InputField
          name="confirmPassword"
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

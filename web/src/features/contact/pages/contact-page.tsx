import {
  Button,
  Card,
  Form,
  InputField,
  ReCaptchaField,
  TextareaField,
} from "@components";
import { Page } from "@components";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "@utils/yup";
import { useContactMutation } from "../api";
import toast from "react-hot-toast";
import { AtSignIcon, InstagramIcon } from "lucide-react";

interface Fields {
  name: string;
  email: string;
  content: string;
  recaptcha: string;
}

const schema = yup.object<Fields>({
  name: yup.string().required().min(3).max(32),
  email: yup.string().required().email(),
  content: yup.string().required().min(3).max(1024),
});

const ContactPage = () => {
  const { mutate: sendContact, isPending } = useContactMutation();

  const handleOnSubmit = (fields: Fields) => {
    sendContact(fields, {
      onSuccess: () => toast.success("Wysłano pomyślnie!"),
    });
  };

  return (
    <Page title="Kontakt" breadcrumbs={[{ label: "Kontakt", isActive: true }]}>
      <div className="flex flex-col w-full gap-4 md:flex-row">
        <Card
          title="Formularz kontaktowy"
          description="Wyślij do nas wiadomość"
          className="w-full md:w-2/3"
        >
          <Form<Fields>
            onSubmit={handleOnSubmit}
            resolver={yupResolver(schema)}
          >
            <div className="flex flex-col w-full gap-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Imię" name="name" isRequired />
                <InputField
                  name="email"
                  label="Email"
                  type="email"
                  isRequired
                />
              </div>
              <TextareaField
                name="content"
                label="Treść"
                className="h-32"
                isRequired
              />
              <div className="flex flex-col ml-auto">
                <ReCaptchaField name="recaptcha" />
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={isPending}
                  loadingText="Wysyłanie..."
                  isLoading={isPending}
                >
                  Wyślij
                </Button>
              </div>
            </div>
          </Form>
        </Card>
        <div className="flex flex-col gap-2">
          <h2 className="font-medium text-primary">
            Dane kontaktowe / socjale
          </h2>
          <a
            href="mailto:kontakt@moto-zloty.pl"
            className="flex items-center gap-1 mt-1"
          >
            <AtSignIcon className="w-5" /> kontakt@moto-zloty.pl
          </a>
          <a
            href="https://instagram.com/moto.zloty"
            target="_blank"
            className="flex items-center gap-1"
          >
            <InstagramIcon className="w-5" /> moto.zloty
          </a>
        </div>
      </div>
    </Page>
  );
};

export { ContactPage };

import { Layout, RegisterForm } from "../components";
import { Metadata } from "@components/metadata";

const RegisterPage = () => {
  return (
    <>
      <Metadata
        title="Rejestracja"
        description="Zarejestruj się do swojego konta"
        canonical="/rejestracja"
      />
      <Layout
        secondaryLabel="Masz już utworzone konto?"
        secondaryButtonLabel="Zaloguj się"
        secondaryButtonHref="/logowanie"
      >
        <RegisterForm />
      </Layout>
    </>
  );
};

export { RegisterPage };

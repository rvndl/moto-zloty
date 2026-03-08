import { Layout, LoginForm } from "../components";
import { Metadata } from "@components/metadata";

const LoginPage = () => {
  return (
    <>
      <Metadata
        title="Logowanie"
        description="Zaloguj się do swojego konta"
        canonical="/logowanie"
      />
      <Layout
        secondaryLabel="Nie posiadasz konta?"
        secondaryButtonLabel="Zarejestruj się"
        secondaryButtonHref="/rejestracja"
      >
        <LoginForm />
      </Layout>
    </>
  );
};

export { LoginPage };

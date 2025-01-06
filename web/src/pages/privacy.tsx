import { Page } from "@components";

const PrivacyPage = () => {
  return (
    <Page
      title="Polityka prywatności"
      breadcrumbs={[
        { to: "/", label: "Moto Zloty" },
        { label: "Polityka prywatności", isActive: true },
      ]}
    >
      <div id="CookieDeclaration"></div>
    </Page>
  );
};

export { PrivacyPage };

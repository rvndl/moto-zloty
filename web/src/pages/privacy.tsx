import { Page } from "@components";

const PrivacyPage = () => {
  return (
    <Page
      title="Polityka prywatności"
      breadcrumbs={[{ label: "Polityka prywatności", isActive: true }]}
    >
      <div id="CookieDeclaration"></div>
    </Page>
  );
};

export { PrivacyPage };

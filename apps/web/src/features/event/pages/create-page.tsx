import { Page } from "@components/page";
import { CreatePageContent } from "../components/create-page-content";
import { Metadata } from "@components/metadata";

const CreatePage = () => {
  return (
    <>
      <Metadata
        title="Stwórz nowe wydarzenie"
        canonical="/wydarzenia/stworz"
        description="Stwórz nowe wydarzenie i udostępnij je innym motocyklistom!"
      />
      <Page
        title="Stwórz nowe wydarzenie"
        breadcrumbs={[{ label: "Nowe wydarzenie", isActive: true }]}
      >
        <CreatePageContent />
      </Page>
    </>
  );
};

export { CreatePage };

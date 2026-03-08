import { Page } from "@components/page";
import { Metadata } from "@components/metadata";
import { CreateView } from "../components";

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
        <CreateView />
      </Page>
    </>
  );
};

export { CreatePage };

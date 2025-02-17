import { Metadata } from "@components";
import { ContactPage } from "@features/contact";

export default function Contact() {
  return (
    <>
      <Metadata
        title="Kontakt"
        description="Skontaktuj się z nami!"
        canonical="/contact"
      />
      <ContactPage />;
    </>
  );
}

import { Metadata } from "@components/metadata";
import { ContactPage } from "@features/contact";

export default function Contact() {
  return (
    <>
      <Metadata
        title="Formularz kontaktowy"
        description="Skontaktuj się z nami!"
        canonical="/kontakt"
      />
      <ContactPage />;
    </>
  );
}

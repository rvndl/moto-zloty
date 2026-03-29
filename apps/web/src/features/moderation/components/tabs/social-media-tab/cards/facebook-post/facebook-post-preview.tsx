import { Textarea } from "@components/textarea";

interface Props {
  content: string;
}

const FacebookPostPreview = ({ content }: Props) => {
  return (
    <section>
      <Textarea
        label="Treść posta"
        rows={22}
        value={content}
        readOnly
        placeholder="Kliknij „Generuj post”, aby przygotować treść posta na Facebooka."
      />
    </section>
  );
};

export { FacebookPostPreview };

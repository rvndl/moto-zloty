import { Label } from "@components/label";

interface Props {
  label: string;
  isRequired?: boolean;
  value?: string;
}

const TextEditorPreview = ({ label, isRequired, value }: Props) => {
  return (
    <div className="h-full">
      <div className="flex flex-col h-full gap-2">
        {Boolean(label) && <Label isRequired={isRequired}>{label}</Label>}
        <div
          className="mt-0"
          dangerouslySetInnerHTML={{ __html: value || "" }}
        />
      </div>
    </div>
  );
};

export default TextEditorPreview;

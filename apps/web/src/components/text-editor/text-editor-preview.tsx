import { Label } from "@components/label";
import { useMemo } from "react";
import { autoLinkTextEditorContent } from "@utils";

interface Props {
  label?: string;
  isRequired?: boolean;
  value?: string;
}

const TextEditorPreview = ({ label, isRequired, value }: Props) => {
  const previewHtml = useMemo(() => autoLinkTextEditorContent(value), [value]);

  return (
    <div className="h-full">
      <div className="flex flex-col h-full gap-2">
        {Boolean(label) && <Label isRequired={isRequired}>{label}</Label>}
        <div
          className="mt-0 text-sm editor-preview"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </div>
    </div>
  );
};

export default TextEditorPreview;

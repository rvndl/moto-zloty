import { Button } from "@components";
import { XIcon } from "lucide-react";

interface Props {
  preview?: string;
  onCancel: () => void;
}

const DropzonePreview = ({ preview, onCancel }: Props) => {
  return (
    <div className="relative w-fit">
      <Button
        variant="secondary"
        size="small"
        className="absolute w-5 h-5 p-0.5 right-1 top-1 text-muted shadow"
        type="button"
        onClick={onCancel}
      >
        <XIcon />
      </Button>
      <img
        className="object-cover w-20 rounded-md"
        src={preview}
        alt="Plakat"
      />
    </div>
  );
};

export { DropzonePreview };

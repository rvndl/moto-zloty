import { useDropzone } from "react-dropzone";
import { Label } from "./label";
import { useState } from "react";
import { Button } from "./button";
import { XIcon } from "./icons";
import clsx from "clsx";
import { Api } from "api";
import { File } from "types/file";

const MAX_FILES = 1;
const MAX_FILE_SIZE = 1024 * 1024 * 2;

interface DropzoneProps {
  label?: string;
  isRequired?: boolean;
  onChange?: (value: string) => void;
}

const Dropzone = ({ label, isRequired, onChange }: DropzoneProps) => {
  const [preview, setPreview] = useState<string>();
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    disabled: Boolean(preview),
    onDropAccepted: async (acceptedFiles) => {
      const [file] = acceptedFiles;
      const objectUrl = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("banner", file);

      const response = await Api.post<File>("/file", formData);

      setPreview(objectUrl);
      onChange?.(response.data.id);
    },
  });

  const hasPreview = Boolean(preview);

  return (
    <div className="flex flex-col gap-2">
      {Boolean(label) && <Label isRequired={isRequired}>{label}</Label>}
      <section className="transition-colors border-2 border-dashed rounded-md shadow hover:bg-accent">
        <div {...getRootProps()} className={clsx(hasPreview ? "p-2" : "p-6")}>
          <input {...getInputProps()} />
          {hasPreview ? (
            <div className="relative w-fit">
              <Button
                variant="secondary"
                size="small"
                className="absolute w-5 h-5 p-0.5 right-1 top-1 text-muted shadow"
                type="button"
                onClick={() => setPreview(undefined)}
              >
                <XIcon />
              </Button>
              <img
                className="object-cover w-20 rounded-md"
                src={preview}
                alt="Banner"
              />
            </div>
          ) : (
            <p className="text-sm text-center transition-colors cursor-pointer text-muted hover:text-primary">
              Przeciągnij lub kliknij tutaj, aby wybrać plik
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export { Dropzone, type DropzoneProps };

import { useDropzone } from "react-dropzone";
import { Label } from "../label";
import { useState } from "react";
import clsx from "clsx";
import { Api } from "api";
import { File } from "types/file";
import { DropzonePreview } from "./dropzone-preview";

const MAX_FILES = 1;
const MAX_FILE_SIZE = 1024 * 1024 * 2;

interface DropzoneImage {
  full_id: string;
  small_id?: string;
}

interface DropzoneProps {
  label?: string;
  isRequired?: boolean;
  onChange?: (value: DropzoneImage) => void;
}

const Dropzone = ({ label, isRequired, onChange }: DropzoneProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>();
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    disabled: Boolean(preview),
    onDropAccepted: async (acceptedFiles) => {
      setIsUploading(true);
      const [file] = acceptedFiles;
      const objectUrl = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("banner", file);

      const response = await Api.post<File>("/file", formData);

      setPreview(objectUrl);
      onChange?.(response.data);
      setIsUploading(false);
    },
  });

  const hasPreview = Boolean(preview);

  return (
    <div className="flex flex-col gap-2">
      {Boolean(label) && <Label isRequired={isRequired}>{label}</Label>}
      <section className="transition-colors border-2 border-dashed rounded-md shadow hover:bg-accent">
        <div
          {...getRootProps()}
          className={clsx(hasPreview || isUploading ? "p-2" : "p-6")}
        >
          <input {...getInputProps()} />
          {hasPreview ? (
            <DropzonePreview
              preview={preview}
              onCancel={() => setPreview(undefined)}
            />
          ) : isUploading ? (
            <div className="w-16 h-20 border rounded-md shadow-sm bg-muted/10 animate-pulse">
              &nbsp;
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-sm text-center transition-colors cursor-pointer text-muted hover:text-primary">
                Przeciągnij lub kliknij tutaj, aby wybrać plik
              </p>
              <small className="text-xs text-muted">
                Wspierane pliki: .jpeg, .jpg, .png, .webp. Maksymalny rozmiar: 2
                MB
              </small>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export { Dropzone, type DropzoneProps, type DropzoneImage };

import { Button } from "@components/button";
import { HelpText } from "@components/help-text";
import { Label } from "@components/label";
import {
  Listbox as HeadlessListbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useId, useRef } from "react";
import { CheckIcon, ChevronDownIcon } from "./icons";

interface ListboxOption {
  id: string;
  label: string;
  value?: any;
}

interface ListboxProps {
  value?: ListboxOption;
  label?: string;
  options: ListboxOption[];
  error?: string;
  isRequired?: boolean;
  onChange?: (value: ListboxOption) => void;
}

const Listbox = ({
  value,
  label,
  options,
  error,
  isRequired,
  onChange,
}: ListboxProps) => {
  const inputRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  return (
    <div className="flex flex-col items-start gap-2">
      {Boolean(label) && (
        <Label htmlFor={id} isRequired={isRequired}>
          {label}
        </Label>
      )}
      <HeadlessListbox value={value} onChange={onChange}>
        <ListboxButton ref={inputRef}>
          <Button
            variant="outline"
            className="relative justify-between font-normal min-w-40"
            textAlignment="left"
          >
            {value?.label ?? "Wybierz..."}
            <ChevronDownIcon className="w-4 " />
          </Button>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className="p-1 mt-1 bg-white border rounded-md shadow min-w-40"
        >
          {options.map((option) => (
            <ListboxOption
              as={Button}
              key={option.id}
              value={option}
              className="flex items-center w-full font-normal text-ellipsis data-[focus]:bg-accent group"
              variant="ghost"
              textAlignment="left"
            >
              <CheckIcon className="w-4 text-primary shrink-0 group-data-[selected]:opacity-100 opacity-0" />
              <p>{option.label}</p>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </HeadlessListbox>
      {Boolean(error) && <HelpText variant="error">{error}</HelpText>}
    </div>
  );
};

export { Listbox, type ListboxOption, type ListboxProps };

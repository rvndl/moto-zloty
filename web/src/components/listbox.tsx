import { Button, ButtonSize, HelpText, Label } from "@components";
import {
  Listbox as HeadlessListbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ReactNode, useId, useRef } from "react";
import { CheckIcon, ChevronDownIcon } from "./icons";

interface ListboxOption {
  id: string;
  label: string;
  value?: unknown;
  icon?: ReactNode;
}

interface ListboxProps {
  value?: ListboxOption;
  label?: string;
  options: ListboxOption[];
  error?: string;
  size?: ButtonSize;
  isRequired?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onChange?: (value: ListboxOption) => void;
}

const Listbox = ({
  value,
  label,
  options,
  error,
  size = "default",
  isRequired,
  isDisabled,
  isLoading,
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
      <HeadlessListbox value={value} onChange={onChange} disabled={isDisabled}>
        <ListboxButton ref={inputRef}>
          <Button
            variant="outline"
            className="relative justify-between font-normal min-w-40"
            textAlignment="left"
            isLoading={isLoading}
            disabled={isDisabled}
            size={size}
          >
            <p className="flex items-center gap-2">
              {value?.icon && <span className="w-4 -ml-1">{value?.icon}</span>}
              {value?.label ?? "Wybierz..."}
            </p>
            <ChevronDownIcon className="w-4" />
          </Button>
        </ListboxButton>
        <ListboxOptions
          transition
          anchor="bottom"
          className="p-1 mt-1 transition duration-100 ease-out bg-white border rounded-md shadow min-w-40 data-[closed]:scale-95 data-[closed]:opacity-0"
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
              <span className="w-4 shrink-0">
                {option.icon ? (
                  <span className="group-data-[selected]:opacity-100 opacity-50 group-hover:opacity-100">
                    {option.icon}
                  </span>
                ) : (
                  <CheckIcon className="text-primary group-data-[selected]:opacity-100 opacity-0" />
                )}
              </span>
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

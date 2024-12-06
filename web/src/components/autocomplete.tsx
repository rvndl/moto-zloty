import {
  Combobox as HeadlessCombobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "./button";
import { Label } from "./label";
import { useDebounce } from "@hooks/use-debounce";
import { HelpText } from "./help-text";

interface AutocompleteOption<TValue = unknown> {
  id: string;
  label: string;
  value?: TValue;
}

interface AutocompleteProps {
  value?: AutocompleteOption;
  label?: string;
  error?: string;
  placeholder?: string;
  minLength?: number;
  isRequired?: boolean;
  fetch?: (query: string) => Promise<AutocompleteOption[]>;
  onChange?: (value: AutocompleteOption) => void;
}

const Autocomplete = ({
  value,
  label,
  fetch,
  error,
  placeholder,
  minLength = 3,
  isRequired,
  onChange,
}: AutocompleteProps) => {
  const id = useId();
  const [options, setOptions] = useState<AutocompleteOption[]>();
  const [query, setQuery] = useState("");
  const setDebouncedQuery = useDebounce(setQuery, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  const classes = clsx(
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
  );

  useEffect(() => {
    if (query.length < minLength) {
      return;
    }

    setOptions(undefined);
    fetch?.(query).then((data) => setOptions(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, minLength]);

  return (
    <div className="flex flex-col gap-2">
      {Boolean(label) && (
        <Label htmlFor={id} isRequired={isRequired}>
          {label}
        </Label>
      )}
      <HeadlessCombobox
        value={value}
        onChange={onChange}
        onClose={() => setQuery("")}
      >
        <ComboboxInput
          ref={inputRef}
          displayValue={(option: AutocompleteOption) => option?.label}
          onChange={(event) => setDebouncedQuery(event.target.value)}
          placeholder={placeholder}
          className={classes}
          autoComplete="off"
        />
        {query.length >= minLength && (
          <ComboboxOptions
            anchor="bottom"
            className="p-1 mt-1 bg-white border rounded-md shadow inline-table"
            style={{ zIndex: 9999, width: inputRef.current?.clientWidth }}
          >
            {options?.length ? (
              options?.map((option) => (
                <ComboboxOption
                  as={Button}
                  key={option.id}
                  value={option}
                  variant="ghost"
                  className="w-full font-normal text-ellipsis"
                  textAlignment="left"
                >
                  {option.label}
                </ComboboxOption>
              ))
            ) : (
              <div className="w-full p-2 text-sm text-center text-muted">
                Brak wyników
              </div>
            )}
          </ComboboxOptions>
        )}
      </HeadlessCombobox>
      {Boolean(error) && <HelpText variant="error">{error}</HelpText>}
    </div>
  );
};

export { Autocomplete, type AutocompleteOption, type AutocompleteProps };

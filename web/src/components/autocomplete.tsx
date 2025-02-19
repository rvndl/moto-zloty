import {
  Combobox as HeadlessCombobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button } from "./button";
import { Label } from "./label";
import { useDebounce } from "@hooks/use-debounce";
import { HelpText } from "./help-text";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type AutocompleteSize = "small" | "default";

interface AutocompleteOption<TValue = unknown> {
  id: string;
  label: string;
  value?: TValue;
}

interface AutocompleteProps<TValue = unknown> {
  value?: AutocompleteOption;
  label?: string;
  placeholder?: string;
  minLength?: number;
  size?: AutocompleteSize;
  error?: string;
  isRequired?: boolean;
  fetch?: (query: string) => Promise<AutocompleteOption<TValue>[]>;
  onChange?: (value: AutocompleteOption<TValue>) => void;
  onItemClick?: (value: AutocompleteOption<TValue>) => void;
  transformer?: (
    value: AutocompleteOption<TValue>,
    query?: string
  ) => ReactNode;
}

const Autocomplete = <TValue = unknown,>({
  value,
  label,
  fetch,
  placeholder,
  minLength = 3,
  size = "default",
  error,
  isRequired,
  onChange,
  onItemClick,
  transformer,
}: AutocompleteProps<TValue>) => {
  const id = useId();
  const [options, setOptions] = useState<AutocompleteOption<TValue>[]>();
  const [query, setQuery] = useState("");
  // @ts-expect-error TODO: fix types
  const setDebouncedQuery = useDebounce(setQuery, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  const classes = twMerge(
    "flex w-full rounded-md border border-input bg-transparent px-3 shadow-sm transition-colors placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50 relative",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    size === "default" && "h-9 py-1 text-sm",
    size === "small" && "h-8 py-2 text-xs"
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
                  key={option.id}
                  {...(!transformer && {
                    as: Button,
                    variant: "ghost",
                    textAlignment: "left",
                  })}
                  value={option}
                  className={clsx(
                    "w-full font-normal text-ellipsis",
                    transformer && "p-0"
                  )}
                  onClick={() => onItemClick?.(option)}
                >
                  {transformer?.(option, query) ?? option.label}
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

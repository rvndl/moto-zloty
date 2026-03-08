import { AutocompleteOption } from "@components/autocomplete";
import { AutocompleteField } from "@components/form/fields/autocomplete-field";
import { api } from "api/eden";

const buildAddressLabel = (address?: {
  name?: string;
  road?: string;
  city?: string;
  state?: string;
}) => {
  if (!address) return "Brak";
  const parts = [
    address.name,
    address.road,
    address.city,
    address.state,
  ].filter(Boolean);
  return parts.join(", ");
};

interface Props {
  name: string;
  label?: string;
  isDisabled?: boolean;
}

const SearchAddressField = ({ name, label = "Adres", isDisabled }: Props) => (
  <AutocompleteField
    name={name}
    label={label}
    placeholder="Wyszukaj lokalizację..."
    fetch={async (query) => {
      const res = await api.placeSearch({ query }).get();
      return (res.data ?? []).map(
        (place) =>
          ({
            id: place.place_id,
            label: buildAddressLabel(place.address),
            value: place,
          }) satisfies AutocompleteOption,
      );
    }}
    isDisabled={isDisabled}
    isRequired
  />
);

export { SearchAddressField };

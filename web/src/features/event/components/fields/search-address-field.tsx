import { AutocompleteOption } from "@components/autocomplete";
import { AutocompleteField } from "@components/form";
import { makeAddressString } from "@features/event/utils";
import { Api } from "api";
import { Place } from "types/place";

interface Props {
  name: string;
  label?: string;
}

const SearchAddressField = ({ name, label = "Adres" }: Props) => (
  <AutocompleteField
    name={name}
    label={label}
    placeholder="Wyszukaj lokalizację..."
    fetch={async (query) => {
      const res = await Api.get<Place[]>(`/place_search/${query}`);
      return res.data.map(
        (place) =>
          ({
            id: place.place_id,
            label: makeAddressString(place.address),
            value: place,
          } satisfies AutocompleteOption)
      );
    }}
    isRequired
  />
);

export { SearchAddressField };

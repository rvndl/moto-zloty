import { AutocompleteOption } from "@components";
import { getFilePath } from "@utils/index";
import Highlighter from "react-highlight-words";
import { Event } from "types/event";

interface Props {
  option: AutocompleteOption<Event>;
  query?: string;
}

const EventSearchItem = ({ option, query }: Props) => {
  return (
    <div className="z-10 flex items-center w-full h-10 max-w-full gap-2 p-1 rounded-md cursor-pointer hover:bg-accent">
      <img
        src={getFilePath(option.value?.banner_small_id)}
        alt="Banner"
        className="object-cover w-auto h-full rounded-md aspect-square shrink-0"
      />
      <div className="grid w-full leading-5">
        <Highlighter
          className="text-sm font-medium truncate md:font-normal"
          searchWords={query?.split(" ") ?? []}
          autoEscape={true}
          textToHighlight={option.label}
        />
        <Highlighter
          className="text-xs truncate text-muted"
          searchWords={query?.split(" ") ?? []}
          autoEscape={true}
          textToHighlight={option.value?.address ?? ""}
        />
      </div>
    </div>
  );
};

export { EventSearchItem };

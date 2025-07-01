import { AutocompleteOption } from "@components";
import { makeAddressString } from "@features/event/utils";
import { getFilePath } from "@utils/index";
import Image from "next/image";
import Highlighter from "react-highlight-words";
import { Event } from "types/event";

interface Props {
  option: AutocompleteOption<Event>;
  query?: string;
}

const EventSearchItem = ({ option, query }: Props) => {
  return (
    <div className="z-10 flex items-center w-full h-10 max-w-full gap-2 p-1 rounded-md cursor-pointer hover:bg-accent">
      <Image
        src={getFilePath(option.value?.banner_small_id)}
        alt="Plakat"
        title="Plakat"
        className="object-cover w-auto h-full rounded-md aspect-square shrink-0"
        width={40}
        height={40}
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
          textToHighlight={makeAddressString(option.value?.full_address) ?? ""}
        />
      </div>
    </div>
  );
};

export { EventSearchItem };

import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";

import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import { $createCodeNode } from "@lexical/code";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Button, ButtonProps } from "@components/button";
import {
  CodeIcon,
  ListOLIcon,
  QuoteIcon,
  TextParagraph,
  TypeH1Icon,
  TypeH2Icon,
} from "@components/icons";
import clsx from "clsx";

interface Props {
  editor: LexicalEditor;
  blockType: string;
  toolbarBoundingClientRect?: DOMRect;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const ToolbarBlockOptions = ({
  editor,
  blockType,
  toolbarBoundingClientRect,
  setIsVisible,
}: Props) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dropdown = dropdownRef.current;

    if (toolbar && dropdown && toolbarBoundingClientRect) {
      const { top, left } = toolbarBoundingClientRect;
      dropdown.style.top = `${top + 40}px`;
      dropdown.style.left = `${left}px`;
      dropdown.style.zIndex = "9999";
    }
  }, [dropdownRef, toolbarBoundingClientRect]);

  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (dropdown && toolbar) {
      const handle = (event) => {
        const target = event.target;

        if (!dropdown.contains(target) /*&& !toolbar.contains(target)*/) {
          setIsVisible(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropdownRef, setIsVisible]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setIsVisible(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setIsVisible(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setIsVisible(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setIsVisible(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setIsVisible(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setIsVisible(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setIsVisible(false);
  };

  return (
    <div
      className="absolute z-10 flex flex-col p-1 bg-white border rounded-md shadow min-w-28"
      ref={dropdownRef}
    >
      <ToolbarOption
        isActive={blockType === "paragraph"}
        onClick={formatParagraph}
        icon={<TextParagraph />}
      >
        Paragraf
      </ToolbarOption>
      <ToolbarOption
        isActive={blockType === "h1"}
        onClick={formatLargeHeading}
        icon={<TypeH1Icon />}
      >
        Duży nagłówek
      </ToolbarOption>
      <ToolbarOption
        isActive={blockType === "h2"}
        onClick={formatSmallHeading}
        icon={<TypeH2Icon />}
      >
        Mały nagłowek
      </ToolbarOption>
      <ToolbarOption
        isActive={blockType === "ul"}
        onClick={formatBulletList}
        icon={<ListOLIcon />}
      >
        Lista punktowana
      </ToolbarOption>
      <ToolbarOption
        isActive={blockType === "ol"}
        onClick={formatNumberedList}
        icon={<ListOLIcon />}
      >
        Lista numeryczna
      </ToolbarOption>
      <ToolbarOption
        isActive={blockType === "quote"}
        onClick={formatQuote}
        icon={<QuoteIcon />}
      >
        Cytat
      </ToolbarOption>
      <ToolbarOption
        isActive={blockType === "code"}
        onClick={formatCode}
        icon={<CodeIcon />}
      >
        Blok kodu
      </ToolbarOption>
    </div>
  );
};

const ToolbarOption = ({
  isActive,
  ...rest
}: ButtonProps & { isActive: boolean }) => (
  <Button
    size="small"
    variant="ghost"
    textAlignment="left"
    className={clsx(!isActive && "text-muted")}
    type="button"
    {...rest}
  />
);

export { ToolbarBlockOptions };

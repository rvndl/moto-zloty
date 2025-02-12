import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  RangeSelection,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isAtNodeEnd } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isListNode, ListNode } from "@lexical/list";
import { createPortal } from "react-dom";
import { $isHeadingNode } from "@lexical/rich-text";
import {
  Button,
  ChevronDownIcon,
  CodeIcon,
  JustifyIcon,
  LinkIcon,
  TextConterIcon,
  TextLeftIcon,
  TextRightIcon,
  TypeBoldIcon,
  TypeItalicIcon,
  TypeStrikethroughIcon,
  TypeUnderlineIcon,
} from "@components";
import { ToolbarButton } from "./toolbar-button";
import { ToolbarFloatingLinkEditor } from "./toolbar-floating-link-editor";
import { ToolbarBlockOptions } from "./toolbar-block-options";

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol",
]);

const blockTypeMeta: Record<string, string> = {
  code: "Blok kodu",
  h1: "Duży nagłówek",
  h2: "Mały nagłówek",
  h3: "Nagłówek",
  h4: "Nagłówek",
  h5: "Nagłówek",
  ol: "Lista numeryczna",
  ul: "Lista punktowana",
  paragraph: "Paragraf",
  quote: "Cytat",
};

function Divider() {
  return <div className="h-6 mx-1 border-l" />;
}

function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [blockType, setBlockType] = useState("paragraph");
  const [showBlockOptions, setShowBlockOptions] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

      const elementKey = element.getKey();

      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);

          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      {supportedBlockTypes.has(blockType) && (
        <>
          <Button
            variant="ghost"
            size="small"
            textAlignment="left"
            className="px-1 min-w-32"
            onClick={() => setShowBlockOptions(!showBlockOptions)}
            aria-label="Formatting Options"
          >
            <p className="flex items-center gap-1">
              {/* TODO: add block type icon */}
              {blockTypeMeta[blockType]}
            </p>
            <ChevronDownIcon className="ml-auto scale-75" />
          </Button>
          {showBlockOptions &&
            createPortal(
              <ToolbarBlockOptions
                editor={editor}
                blockType={blockType}
                setIsVisible={setShowBlockOptions}
                toolbarBoundingClientRect={toolbarRef.current?.getBoundingClientRect()}
              />,
              document.body
            )}
          <Divider />
        </>
      )}

      <div className="grid grid-flow-col gap-1">
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          isActive={isBold}
          aria-label="Format Bold"
        >
          <TypeBoldIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          isActive={isItalic}
          aria-label="Format Italics"
        >
          <TypeItalicIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
          isActive={isUnderline}
          aria-label="Format Underline"
        >
          <TypeUnderlineIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
          }
          isActive={isStrikethrough}
          aria-label="Format Strikethrough"
        >
          <TypeStrikethroughIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
          isActive={isCode}
          aria-label="Insert Code"
        >
          <CodeIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={insertLink}
          aria-label="Insert Link"
          isActive={isLink}
        >
          <LinkIcon className="scale-[0.6]" />
        </ToolbarButton>
        {isLink &&
          createPortal(
            <ToolbarFloatingLinkEditor editor={editor} />,
            document.body
          )}
        <Divider />
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
          aria-label="Left Align"
        >
          <TextLeftIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
          }
          aria-label="Center Align"
        >
          <TextConterIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
          }
          aria-label="Right Align"
        >
          <TextRightIcon className="scale-[0.6]" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
          }
          aria-label="Justify Align"
        >
          <JustifyIcon className="scale-[0.6]" />
        </ToolbarButton>
      </div>
    </div>
  );
}

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";
import { $generateHtmlFromNodes } from "@lexical/html";

import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { Label } from "@components";
import { useEffect, useState } from "react";
import { ToolbarPlugin } from "./plugins";
import { editorTheme } from "./theme";
import { EditorState, LexicalEditor } from "lexical";

const editorConfig: InitialConfigType = {
  theme: editorTheme,
  namespace: "text-editor",
  onError(error: unknown) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
  ],
};

interface TextEditorProps {
  label?: string;
  placeholder?: string;
  value?: string;
  isRequired?: boolean;
  isNonEditable?: boolean;
  onChange?: (value: string) => void;
}

const TextEditor = ({
  label,
  value,
  isRequired,
  isNonEditable,
  onChange,
}: TextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOnDataChange = (
    editorState: EditorState,
    editor: LexicalEditor
  ) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      onChange?.(html);
    });
  };

  if (!isMounted) return null;

  return (
    <div className="h-full">
      <div className="flex flex-col h-full gap-2">
        {Boolean(label) && <Label isRequired={isRequired}>{label}</Label>}
        {isNonEditable ? (
          <div
            className="mt-0"
            dangerouslySetInnerHTML={{ __html: value || "" }}
          />
        ) : (
          <LexicalComposer
            initialConfig={{
              ...editorConfig,
              ...(typeof value !== "string" && { editorState: value }),
            }}
          >
            <div className="border rounded-md shadow-sm">
              <ToolbarPlugin />
              <div className="h-full overflow-y-auto max-h-72">
                <div className="h-full overflow-auto">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="editor-input" />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <ListPlugin />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                  <LinkPlugin />
                  <TabIndentationPlugin />
                  <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                  <OnChangePlugin onChange={handleOnDataChange} />
                </div>
              </div>
            </div>
          </LexicalComposer>
        )}
      </div>
    </div>
  );
};

export { TextEditor, type TextEditorProps };

import { useState, useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  InlineEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageToolbar,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  SelectAll,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  EditorConfig,
  EventInfo,
} from "ckeditor5";

import translations from "ckeditor5/translations/pl.js";

import "ckeditor5/ckeditor5.css";
import { Label } from "@components";

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
  placeholder,
  value,
  isRequired,
  isNonEditable,
  onChange,
}: TextEditorProps) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig: EditorConfig = {
    toolbar: {
      items: [
        "|",
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "horizontalLine",
        "link",
        "insertImageViaUrl",
        "insertTable",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
      ],
      shouldNotGroupWhenFull: true,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      Essentials,
      Heading,
      HorizontalLine,
      ImageBlock,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageToolbar,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      Paragraph,
      SelectAll,
      Strikethrough,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
    ],
    balloonToolbar: [
      "bold",
      "italic",
      "|",
      "link",
      "|",
      "bulletedList",
      "numberedList",
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    image: {
      toolbar: ["imageTextAlternative", "|", "resizeImage"],
    },
    language: "pl",
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder,
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
    translations: [translations],
  };

  const handleOnDataChange = (_: EventInfo, editor: InlineEditor) => {
    const data = editor.getData();
    onChange?.(data);
  };

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
          <div
            className="editor-container editor-container_inline-editor"
            ref={editorContainerRef}
          >
            <div className="editor-container__editor">
              <div className="h-full" ref={editorRef}>
                {isLayoutReady && (
                  <CKEditor
                    editor={InlineEditor}
                    config={editorConfig}
                    data={value}
                    onChange={handleOnDataChange}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { TextEditor, type TextEditorProps };

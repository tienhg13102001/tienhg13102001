"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useMemo } from "react";
import { Loader2 } from "lucide-react";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[200px] w-full items-center justify-center rounded-md border border-input bg-transparent">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  id?: string;
}

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder,
  id,
}: RichTextEditorProps) {
  // We need to keep track of the value to sync it to the hidden input
  // Wait, if it's uncontrolled, we can use onChange to update a hidden input
  // Or we can just let ReactQuill be uncontrolled and use a ref?
  // ReactQuill works better as a controlled component if we need to sync it.
  
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image", "code-block"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "code-block",
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 
        To make it work smoothly with standard FormData, 
        we use an uncontrolled hidden input that ReactQuill updates.
      */}
      <div className="relative w-full rounded-md border border-input bg-background overflow-hidden [&_.ql-toolbar]:border-x-0 [&_.ql-toolbar]:border-t-0 [&_.ql-toolbar]:bg-muted/50 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-base">
        <ReactQuill
          theme="snow"
          defaultValue={defaultValue}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          id={id}
          onChange={(content, delta, source, editor) => {
            // Update the hidden input value
            const hiddenInput = document.getElementById(
              `hidden-${name}`
            ) as HTMLInputElement;
            if (hiddenInput) {
              // If the editor is completely empty, it usually returns '<p><br></p>'
              // We might want to save it as empty string if that's the case.
              const html = editor.getHTML();
              hiddenInput.value = html === "<p><br></p>" ? "" : html;
            }
          }}
        />
      </div>
      <input
        type="hidden"
        id={`hidden-${name}`}
        name={name}
        defaultValue={defaultValue}
      />
    </div>
  );
}

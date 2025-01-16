import React from "react";
import Editor from "@monaco-editor/react";
import { FileItem } from "@/lib/types";

interface CodeEditorProps {
  file: FileItem | null;
  isDarkMode: boolean; // Prop indicating whether dark mode is active
}

export function CodeEditor({ file, isDarkMode }: CodeEditorProps) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a file to view its contents
      </div>
    );
  }

  // Set Monaco editor theme based on isDarkMode prop
  const editorTheme = isDarkMode ? "vs-dark" : "vs";

  return (
    <Editor
      height="100%"
      defaultLanguage="typescript"
      theme={editorTheme} // Dynamically set theme based on isDarkMode prop
      value={file.content || ""}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
}
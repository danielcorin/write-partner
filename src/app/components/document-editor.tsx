"use client";

import { useStore } from "@/lib/state";
import { DiffEditor, Editor, Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

const options = {
  readOnly: true,
  renderSideBySide: false,
  wordWrap: "on" as "on",
  scrollBeyondLastLine: true,
  scrollbar: {
    verticalScrollbarSize: 7,
    horizontalScrollbarSize: 7,
  },
  minimap: {
    enabled: false,
  },
  cursorBlinking: "solid" as "solid",
  suggest: {
    filterGraceful: false,
    snippetsPreventQuickSuggestions: true,
    showIcons: false,
    maxVisibleSuggestions: 0,
    showMethods: false,
    showFunctions: false,
    showConstructors: false,
    showFields: false,
    showVariables: false,
    showClasses: false,
    showModules: false,
    showProperties: false,
    showEvents: false,
    showOperators: false,
    showUnits: false,
    showValues: false,
    showConstants: false,
    showEnums: false,
    showEnumMembers: false,
    showKeywords: false,
    showWords: false,
    showColors: false,
    showFiles: false,
    showReferences: false,
    showFolders: false,
    showTypeParameters: false,
    showSnippets: false,
  },
} as monaco.editor.IStandaloneEditorConstructionOptions;

const DocumentEditor: React.FC = () => {
  const [{ document, proposedDocument, proposingChanges }, dispatch] =
    useStore();

  const setProposedDocument = (document: string) => {
    dispatch({ type: "setProposedDocument", document: document });
  };

  const setDocument = (document: string) => {
    dispatch({ type: "setDocument", document: document });
  };

  const handleDiffEditorDidMount = (
    editor: monaco.editor.IStandaloneDiffEditor,
    monaco: Monaco,
  ) => {
    const modifiedEditor = editor.getModifiedEditor();
    modifiedEditor.onDidChangeModelContent((_event) => {
      setProposedDocument(modifiedEditor.getValue());
    });
  };

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editor.onDidChangeModelContent((_event) => {
      setDocument(editor.getValue());
    });
  };

  return (
    <>
      {proposingChanges ? (
        <>
          <div style={{ height: "100%", overflowY: "auto" }}>
            <DiffEditor
              width="100%"
              height="100%"
              language="markdown"
              original={document}
              modified={proposedDocument}
              options={options}
              onMount={handleDiffEditorDidMount}
            />
          </div>
        </>
      ) : (
        <div style={{ height: "100%", overflowY: "auto" }}>
          <Editor
            width="100%"
            height="97%"
            language="markdown"
            value={document}
            options={options}
            onMount={handleEditorDidMount}
          />
        </div>
      )}
    </>
  );
};

export default DocumentEditor;

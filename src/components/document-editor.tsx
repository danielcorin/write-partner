"use client"

import { useStore } from "@/lib/state";
import { DiffEditor, Editor, Monaco } from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import EditorControls from "./editor-controls";


type EditorProps = {
    proposingChanges: boolean;
};

const options = {
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
    cursorBlinking: 'solid' as 'solid',
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
        showSnippets: false
    }
}

const DocumentEditor: React.FC<EditorProps> = ({ proposingChanges }) => {

    const [{ document, proposedDocument }, dispatch] = useStore()

    const updateProposedDocument = (document: string) => {
        dispatch({ type: 'setProposedDocument', document: document })
    }

    const updateDocument = (document: string) => {
        dispatch({ type: 'setDocument', document: document })
    }

    const handleDiffEditorDidMount = (editor: monaco.editor.IStandaloneDiffEditor, monaco: Monaco) => {
        const modifiedEditor = editor.getModifiedEditor();
        modifiedEditor.onDidChangeModelContent((_event) => {
            updateProposedDocument(modifiedEditor.getValue())
        });
    };

    const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
        editor.onDidChangeModelContent((_event) => {
            updateDocument(editor.getValue())
        });
    };

    return (
        <>
            {proposingChanges ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            style={{ width: '49%', padding: '10px', marginRight: '1%' }}
                            onClick={() => {
                                updateDocument(proposedDocument)
                                updateProposedDocument("")
                            }}
                        >
                            Accept
                        </button>
                        <button
                            style={{ width: '49%', padding: '10px', marginLeft: '1%' }}
                            onClick={() => {
                                updateProposedDocument("")
                            }}
                        >
                            Reject
                        </button>
                    </div>
                    <div style={{ height: '100%', overflowY: 'auto' }}>
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
                <div style={{ height: '100%', overflowY: 'auto' }}>
                    <Editor
                        width="100%"
                        height="97%"
                        language="markdown"
                        value={document}
                        options={options}
                        onMount={handleEditorDidMount}
                    />
                    <EditorControls/>
                </div>
            )}
        </>
    );
};

export default DocumentEditor;

'use client';

import { useEffect, useState } from "react";

/* Lexical Design System */
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    TRANSFORMERS
} from "@lexical/markdown";

/* Lexical Plugins Local */
import TreeViewPlugin from "@/app/plugins/TreeViewPlugin";
import ToolbarPlugin from "@/app/plugins/ToolbarPlugin";
import AutoLinkPlugin from "@/app/plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "@/app/plugins/CodeHighlightPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

/* Lexical Plugins Remote */
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";

/* Lexical Others */
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import Theme from "@/app/themes/Theme";
import { EditorState } from "lexical";
import { useStore } from "@/lib/state";
import EditorSyncPlugin from "../plugins/EditorSyncPlugin";

function Placeholder() {
    return <div className="editor-placeholder"></div>;
}

export function Editor(): JSX.Element | null {
    const [isMounted, setIsMounted] = useState(false)
    const [{ document, proposedDocument }, dispatch] = useStore()

    const editorConfig = {
        // The editor theme
        theme: Theme,
        namespace: "write-partner-editor",
        // Handling of errors during update
        onError(error: unknown) {
            throw error;
        },
        // Any custom nodes go here
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
            LinkNode
        ],
    };

    const setProposedDocument = (proposedDoc: string) => {
        dispatch({ type: 'setProposedDocument', document: proposedDoc });
    };

    const setDocument = (doc: string) => {
        dispatch({ type: 'setDocument', document: doc });
    };

    // When the editor changes, you can get notified via the
    // LexicalOnChangePlugin
    function onChange(editorState: EditorState) {
        const markdown: string = editorState.read(() => {
            return $convertToMarkdownString();
        });
        if (proposedDocument) {
            if (markdown !== proposedDocument) {
                setProposedDocument(markdown)
            }
        } else {
            if (markdown !== document) {
                setDocument(markdown)
            }
        }
    }

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
                <ToolbarPlugin />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={onChange} />
                    <ListPlugin />
                    <HistoryPlugin />
                    <CodeHighlightPlugin />
                    <LinkPlugin />
                    <TabIndentationPlugin />
                    <AutoLinkPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <EditorSyncPlugin transformers={TRANSFORMERS} />
                    {/* <TreeViewPlugin /> */}
                </div>
            </div>
        </LexicalComposer>
    );
}

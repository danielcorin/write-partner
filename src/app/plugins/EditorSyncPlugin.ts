'use client';

import { useStore } from "@/lib/state";
import type { Transformer } from '@lexical/markdown';
import {
    $convertFromMarkdownString,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

type EditorSyncPluginProps = {
    transformers: Transformer[] | undefined;
};


export default function EditorSyncPlugin({ transformers }: EditorSyncPluginProps) {
    const [editor] = useLexicalComposerContext();

    const [{ document, proposedDocument, loadingResults }, _] = useStore()

    useEffect(() => {
        if (loadingResults) {
            editor.update(() => {
                if (proposedDocument) {
                    $convertFromMarkdownString(proposedDocument, transformers);
                }
                else {
                    $convertFromMarkdownString(document, transformers);
                }
            });
        }
    }, [proposedDocument, document]);
    return null
}